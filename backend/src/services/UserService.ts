//external dependencies
import {v4 as uuidv4} from 'uuid';

//internal dependencies
import { User, UserIGAccount, FacebookLoginToken, LoginResult, IUserService, IUserRepository } from "../models/User";
import { IFidelityRepository } from '../models/Fidelity';
import Utils from '../utils/Utils';
import EmailService from './EmailService';

class UserService implements IUserService {
    constructor(
        private userRepository: IUserRepository,
        private emailService: EmailService,
        private fidelityRepository: IFidelityRepository
    ) {}

    async getById(id_user: string): Promise<User | {}> {
        return await this.userRepository.getById(id_user);
    }

    createSessionTokens(id_user: string, authenticated: boolean): LoginResult {
        //TEMP: Shoudl this function be here or in Utils ?
        //TEMP: include the id of the user and the id of the store.
        let result: LoginResult = {
            authenticated
        }

        if (result.authenticated) {
            const payload = {
                id: id_user
            }
            result.token = Utils.generateJWT(payload, process.env.ACCESS_TOKEN_EXPIRES_IN as string);
            result.refreshToken = Utils.generateJWT(payload, process.env.REFRESH_TOKEN_EXPIRES_IN as string);
        }
        
        return result;
    }

    async createUser(body: User): Promise<LoginResult> {
        try {
            //create user id
            body.id_user = uuidv4();

            //encrypt user password
            if (body.password != null) {
                body.password = await Utils.encryptPassword(body.password);
            }
            
            //include in the database
            const id_user = await this.userRepository.createUser(body);

            //create default fidelity config
            this.fidelityRepository.createFidelityTarget(id_user);

            //Create session token
            const result = this.createSessionTokens(id_user, true);

            //send email verification
            this.emailService.sendVerificationEmail(body.id_user, body.email, body.name);

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
            const userId =  tokenInfo.id as string;
            const email = tokenInfo.email as string

            const result = await this.userRepository.verifyEmail(userId, email);

            if (!result) {
                return {status: 404, json: {error: 'Invalid token'}};
            }

            return {status: 200, json: {}};
        } catch (error) {
            throw error
        }
    }

    async login(email: string, password: string): Promise<LoginResult> {
        const {password_hash, id_user} = await this.userRepository.login(email);

        let result: LoginResult = {
            authenticated: false
        }

        if (password_hash && id_user) {
            result.authenticated = await Utils.comparePasswords(password, password_hash);

            result = this.createSessionTokens(id_user, result.authenticated)
        }
        
        return result;
    }
}

export default UserService;