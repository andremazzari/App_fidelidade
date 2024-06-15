//external dependencies
import { Router, Request, Response } from "express";

//internal dependencies
import FacebookFactory from "../factory/FacebookFactory";
import { AuthenticationMiddleware } from "../middlewares/AuthenticationMiddleware";

const facebookRouter = Router();

const facebookController = FacebookFactory.controller();

facebookRouter.get('/whatsapp/templates/', AuthenticationMiddleware, (req: Request, res: Response) => facebookController.searchWhatsappTemplate(req, res))

export default facebookRouter;