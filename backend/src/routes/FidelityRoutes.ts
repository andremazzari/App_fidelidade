//external dependencies
import { Router, Request, Response } from "express";

//internal dependencies
import FidelityFactory from "../factory/FidelityFactory";
import { AuthenticationMiddleware } from "../middlewares/AuthenticationMiddleware";
import { registerAuthorization } from "../middlewares/AuthorizationMiddleware";

const fidelityController = FidelityFactory.controller();

const fidelityRouter = Router();

fidelityRouter.post('/registerFidelity', AuthenticationMiddleware, registerAuthorization, (req: Request, res: Response) => fidelityController.registerFidelity(req, res));
fidelityRouter.get('/getRecords', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.getRecords(req, res));
fidelityRouter.get('/getRecordsCountPages', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.getRecordsCountPages(req, res));
fidelityRouter.get('/fidelity/info', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.getFidelityInfo(req, res))
fidelityRouter.get('/fidelityConfig', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.getFidelityConfig(req, res));
fidelityRouter.put('/updateTarget', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.updateFidelityTarget(req, res));
fidelityRouter.post('/fidelity/redeem', AuthenticationMiddleware, (req: Request, res: Response) => fidelityController.redeemFidelity(req, res));

export default fidelityRouter;