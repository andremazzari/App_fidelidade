//internal dependencies
import { IFidelityController, IFidelityService, IFidelityRepository } from "../models/Fidelity";
import FidelityController from "../controllers/FidelityController";
import FidelityService from "../services/FidelityService";
import FidelityRepository from "../repositories/FidelityRepository";

class FidelityFactory {
    static controller(): IFidelityController {
        return new FidelityController(
            this.service()
        )
    }

    static service(): IFidelityService {
        return new FidelityService(
            this.repository()
        )
    }

    static repository(): IFidelityRepository {
        return new FidelityRepository()
    }
}

export default FidelityFactory;