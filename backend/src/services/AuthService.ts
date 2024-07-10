//external dependencies
import {v4 as uuidv4} from 'uuid';

//internal dependencies
import Utils from "../utils/Utils";
import { redisClient } from "../connectors/Redis";
import { LoginResult } from '../models/User';

class AuthService {
    async createServerSession(companyId: string, userId: string) {
        //TEMP: set these TTL in env var. Unify with serverless env vars
        const sessionTTL = 3600; //in seconds
        const userTTL = 3600 * 24 * 7; //in seconds

        const sessionId = uuidv4();

        const sessionPayload = {
            companyId,
            userId
        }

        try {
            //set the session
            await redisClient.set(`session:${sessionId}`, sessionPayload, {EX: sessionTTL});

            //check if already this is an active session and invalidate it.
            const existingSessionId = await redisClient.get(`user:${userId}`);
            if (existingSessionId) {
                await redisClient.del(`session:${existingSessionId}`)
            }

            //references the session to the user
            await redisClient.set(`user:${userId}`, sessionId, {EX: userTTL});

            //Create jwt token
            const tokenPayload = {
                id: sessionId
            }

            return Utils.generateJWT(tokenPayload, process.env.ACCESS_TOKEN_EXPIRES_IN as string);
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }

    createServerlessSession(companyId: string, userId: string) {
        //create JWT token
        const payload = {
            id: companyId,
            userId
        }

        return Utils.generateJWT(payload, process.env.ACCESS_TOKEN_EXPIRES_IN as string);
    }

    async createSession(companyId: string, userId: string): Promise<LoginResult> {
        let result: LoginResult = {authenticated: true}
        try {
            if (process.env.SESSION_MODE == 'SERVER') {
                result.token = await this.createServerSession(companyId, userId);
            } else {
                result.token = this.createServerlessSession(companyId, userId);
            }

            return result
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }

    async checkServerSession(token: string): Promise<any> {
        //Returns false if session is invalid. Otherwise, returns object with session info.
        const decodedToken = Utils.decodeJWT(token);
        if (!decodedToken.id) {
            return false
        }

        const sessionId = decodedToken.id;

        //get session data
        const sessionInfo = await redisClient.get(`session:${sessionId}`);

        if (sessionInfo == null || Utils.isString(sessionInfo)) {
            return false
        }

        //check if this session is the active one for the user.
        const userSession = await redisClient.get(`user:${sessionInfo.userId}`);

        if (userSession == null || userSession != sessionId) {
            return false
        }

        return sessionInfo;
    }

    checkServerlessSession(token: string) {
        //Returns false if session is invalid. Otherwise, returns object with session info.
        const decodedToken = Utils.decodeJWT(token);
        if (!decodedToken.userId || !decodedToken.id) {
            return false
        }

        return {userId: decodedToken.userId, companyId: decodedToken.id}
    }

    async checkSession(token: string) {
        //verify if token is valid
        if (!Utils.verifyJWT(token)) {
            return false;
        }

        try {
            if (process.env.SESSION_MODE == 'SERVER') {
                return await this.checkServerSession(token);
            } else {
                return this.checkServerlessSession(token);
            }
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }
}

export default AuthService;