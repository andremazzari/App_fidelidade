//internal dependencies
import {IFacebookController, IFacebookService, IFacebookRepository } from "../models/Facebook"
import FacebookController from "../controllers/FacebookController"
import FacebookService from "../services/FacebookService"
import FacebookRepository from "../repositories/FacebookRepository"

class FacebookFactory {
    static controller(): IFacebookController {
        return new FacebookController(
            this.service()
        )
    }

    static service(): IFacebookService {
        return new FacebookService (
            this.repository()
        )
    }

    static repository(): IFacebookRepository {
        return new FacebookRepository()
    }
}

export default FacebookFactory