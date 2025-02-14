//external dependencies
import { Router, Request, Response } from "express";

//internal dependencies
import UserFactory from "../factory/UserFactory";
import { AuthenticationMiddleware } from "../middlewares/AuthenticationMiddleware";

const userController = UserFactory.controller();

const userRouter = Router();

userRouter.get('/user/:userId', AuthenticationMiddleware, (req: Request, res: Response) => userController.getById(req, res));
userRouter.post('/user/signup', (req: Request, res: Response) => userController.signUp(req, res));
userRouter.post('/user/verifyEmail', (req: Request, res: Response) => userController.verifyEmail(req, res));
userRouter.post('/user/forgotPassword', (req: Request, res: Response) => userController.forgotPassword(req, res));
userRouter.post('/user/resetPassword', (req: Request, res: Response) => userController.resetPassword(req, res));


//login routes
userRouter.post('/user/login', (req: Request, res: Response) => userController.login(req, res));
userRouter.post('/user/whatsapp/login', AuthenticationMiddleware, (req: Request, res: Response) => userController.whatsappLogin(req, res));

export default userRouter;