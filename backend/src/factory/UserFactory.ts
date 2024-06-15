//internal dependencies
import UserController from "../controllers/UserController";
import UserService from "../services/UserService"
import UserRepository from "../repositories/UserRepository";
import { IUserController, IUserService, IUserRepository } from "../models/User";
import EmailService from "../services/EmailService";
import FidelityFactory from "./FidelityFactory";
import FacebookFactory from "./FacebookFactory";

class UserFactory {
    static controller(): IUserController {
        return new UserController(
            this.service()
        )
    }

    static service(): IUserService {
        return new UserService(
            this.repository(),
            new EmailService(),
            FacebookFactory.service(),
            FidelityFactory.repository(),
            FacebookFactory.repository()
        )
    }

    static repository(): IUserRepository {
        return new UserRepository();
    }
}

export default UserFactory;