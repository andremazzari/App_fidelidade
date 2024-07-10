//external dependencies
import {v4 as uuidv4} from 'uuid';

//internal dependencies
import { User, LoginResult, IUserService, IUserRepository } from "../models/User";
import { IFidelityRepository } from '../models/Fidelity';
import Utils from '../utils/Utils';
import AuthService from './AuthService';
import EmailService from './EmailService';
import { IFacebookService, IFacebookRepository, isFacebookAPIError } from '../models/Facebook';
import { mysqlClient } from "../connectors/MySQL";

class UserService implements IUserService {
    constructor(
        private userRepository: IUserRepository,
        private authService: AuthService,
        private emailService: EmailService,
        private facebookService: IFacebookService,
        private fidelityRepository: IFidelityRepository,
        private facebookRepository: IFacebookRepository
    ) {}

    async getById(userId: string, companyId: string): Promise<User | {}> {
        return await this.userRepository.getById(userId, companyId);
    }

    async signUp(userInfo: User): Promise<LoginResult> {
        try {
            //start transaction
            //TEMP: validate if the transaction implmentaion is rgith (specially when change to pools).
            await mysqlClient.startTransaction();
            //create company
            const companyId = uuidv4();
            await this.userRepository.createCompany(companyId);
            
            //create default fidelity config
            this.fidelityRepository.createFidelityConfig(companyId);

            //create user
            userInfo.userId = uuidv4();
            userInfo.companyId = companyId;
            //User type: Owner
            userInfo.type = 'O';

            //encrypt user password
            if (userInfo.password != null) {
                userInfo.password = await Utils.encryptPassword(userInfo.password);
            }
            
            //create owner user in the database
            await this.userRepository.createUser(userInfo);
            await mysqlClient.commit();
        } catch (error) {
            console.log('Erro na transação: ', error)
            await mysqlClient.rollback();
            //TEMP: validate the types of errors that can be returned in each step
            throw error;
        }

        try {
            //Create session token
            const result = this.authService.createSession(userInfo.companyId, userInfo.userId);

            //send email verification
            await this.emailService.sendVerificationEmail(userInfo.companyId, userInfo.userId, userInfo.email, userInfo.name);

            return result;
        } catch (error) {
            //TEMP: validate the types of errors that can be returned in each step
            throw error;
        }
    }

    async verifyEmail(verificationToken: string): Promise<any> {
        //TEMP: define the type returned
        try {
            if (!Utils.verifyJWT(verificationToken, process.env.JWT_PUBLIC_KEY_EMAIL_VERIFICATION as string)) {
                //invalid token
                return {status: 401, json: {error: 'Invalid token'}};
            }
            const tokenInfo = Utils.decodeJWT(verificationToken);
            
            const result = await this.userRepository.verifyEmail(tokenInfo.id as string, tokenInfo.userId as string);
            
            if (!result) {
                return {status: 404, json: {error: 'Invalid token'}};
            }

            return {status: 200, json: {}};
        } catch (error) {
            throw error
        }
    }

    async forgotPassword(email: string): Promise<boolean> {
        try {
            const userId = await this.userRepository.verifyUserByEmail(email);

            if (userId == null) {
                return false;
            }

            const token = uuidv4();
            const expiresAt = Utils.timestampToMySQL(0, new Date(Date.now() + 3600000)); // Token expires in 1 hour
            //register forgot password request in the database
            await this.userRepository.forgotPassword(userId, token, expiresAt);

            //send reset password email
            await this.emailService.sendResetPasswordEmail(userId, token, email);

            return true;
        } catch (error) {
            return false;
        }
    }

    async resetPassword(userId: string, token: string, password: string): Promise<boolean> {
        try {
            //check if token is valid
            const tokenInfo = await this.userRepository.getLastResetPasswordTokenInfo(userId);

            const expireTimestamp = new Date(tokenInfo.expiresAt);
            const currentTimestamp = new Date();

            if (Utils.isEmptyObject(tokenInfo) || expireTimestamp < currentTimestamp || token != tokenInfo.token || tokenInfo.usedAt != null) {
                //invalid reset password request
                return false;
            }

            //change password in the database
            const encryptedPassword = await Utils.encryptPassword(password)

            await this.userRepository.resetPassword(userId, token, encryptedPassword);

            return true
        } catch (error) {
            return false
        }
    }

    async login(email: string, password: string): Promise<LoginResult> {
        const {companyId, userId, passwordHash} = await this.userRepository.login(email);

        let result: LoginResult = {
            authenticated: false
        }

        if (passwordHash && userId && companyId) {
            result.authenticated = await Utils.comparePasswords(password, passwordHash);

            result = await this.authService.createSession(companyId, userId);
        }
        
        return result;
    }

    async whatsappLogin(companyId: string, code: string): Promise<any> {
        //TEMP: create an interface and codes to handle each error
        const tokenData = await this.facebookService.getAccessToken(code);

        if (isFacebookAPIError(tokenData)) {
            //TEMP: handle this error
            return tokenData
        }

        const debugToken = await this.facebookService.debugToken(tokenData.access_token);

        if (debugToken.data.is_valid != true) {
            //Error: invalid token
            //TEMP: handle this error
            return {error: 'Invalid token'}
        }

        const missingPermissions = this.facebookService.checkWhatsappPermissions(debugToken.data.scopes);

        if (missingPermissions.length > 0) {
            //Error: user did not give all necessary permissions
            return {missingPermissions}
        }

        //TEMP: consider the case in which it is not the first login of the user, but only and re-login, and there is already a waba registered.
        const wabaId = this.facebookService.getWABAId(debugToken.data.granular_scopes);

        if (!wabaId) {
            //Error: no WABA id was shared
            return {wabaId}
        }

        const wabaInfo = await this.facebookService.getWABAInfo(wabaId, tokenData.access_token);

        if (isFacebookAPIError(wabaInfo)) {
            //TEMP: handle this error
            return wabaInfo
        }

        //Save this info in the database
        //TEMP: handle the case in which the user is only reconnecting
        if (!this.facebookService.checkWhatsappInfoBeforeDB(tokenData.access_token, debugToken, wabaInfo)) {
            //Whatsapp info violates the constraints in the database
            //TEMP: handle this error
            return {error: 'Whatsapp info violates the constraints in the database'}
        }
        this.facebookRepository.upsertWhatsappInfo(companyId, tokenData.access_token, debugToken, wabaInfo);

        return {ok: 'ok!'};
    }
}

export default UserService;