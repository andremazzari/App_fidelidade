//external dependencies
import { Request, Response } from "express";

//internal dependencies
import { UserGetByIdSchema,
         UserAddSchema,
         UserVerifyEmail,
        UserLoginSchema,
        UserWhatsappLogin} from "../schemas/UserSchema";
import UserSchemas from "../schemas/UserSchema";
import { IUserController, IUserService } from "../models/User";

class UserController implements IUserController {

    constructor(private userService: IUserService) {}

    async getById(req: Request, res: Response): Promise<Response> {
        const id_user = req.params.id_user;

        try {
            await UserSchemas.getById().validate({id_user});
            //await UserGetByIdSchema.validate({id_user});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.userService.getById(id_user);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        const user_info = req.body;

        try {
            await UserSchemas.createUser().validate({user_info});
            //await UserAddSchema.validate({user_info}); 
        } catch(error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.userService.createUser(user_info);
            return res.status(201).json(result);
        } catch (error) {
            //TEMP: validate the types of error that can be returned
            return res.status(500).json({error});
        }
    }
    
    async verifyEmail(req: Request, res: Response): Promise<Response> {
        const verificationToken = req.body.verificationToken;

        try {
            await UserSchemas.verifyEmail().validate({verificationToken});
            //await UserVerifyEmail.validate({verificationToken});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.userService.verifyEmail(verificationToken);

            return res.status(result.status).json(result.json);
        } catch(error) {
            return res.status(500).json({error});
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        const email = req.body.email;
        const password = req.body.password;

        try {
            await UserSchemas.login().validate({email, password});
            //await UserLoginSchema.validate({email, password});
        } catch(error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.userService.login(email, password);
            let status = 401;
            if (result.authenticated) {
                status = 200;
            }
            return res.status(status).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async whatsappLogin(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const code = req.body.code;

        try {
            await UserSchemas.whatsappLogin().validate({userId, code});
            //await UserWhatsappLogin.validate({userId, code});
        } catch(error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.userService.whatsappLogin(userId, code);
            
            //TEMP: handle errors and different types of returns
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }
}

export default UserController;