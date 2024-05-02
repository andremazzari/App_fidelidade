//external dependencies
import { Router, Request, Response } from "express";

//internal dependencies
import UserFactory from "../factory/UserFactory";

const userController = UserFactory.controller();

const userRouter = Router();

userRouter.get('/user/:id_user', (req: Request, res: Response) => userController.getById(req, res));
userRouter.post('/user', (req: Request, res: Response) => userController.createUser(req, res));
userRouter.post('/user/verifyEmail', (req: Request, res: Response) => userController.verifyEmail(req, res));

//login routes
userRouter.post('/user/login', (req: Request, res: Response) => userController.login(req, res));

export default userRouter;