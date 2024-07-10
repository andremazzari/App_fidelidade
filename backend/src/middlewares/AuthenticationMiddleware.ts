//external dependencies
import { Request, Response, NextFunction } from "express";

//internal dependencies
import AuthenticationSchemas from "../schemas/AuthenticationSchema";
import AuthService from "../services/AuthService";

export async function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    
    try {
        await AuthenticationSchemas.token().validate({authorization});
    } catch (error) {
        //TEMP: in prod, only sends 401 Authentication failed
        return res.status(400).json({error});
    }

    try {
        const token = authorization!.split(' ')[1];

        //TEMP: should I rewrite this to be in the same form as the other classes (with authService as parameters of class) ? Is there any performance impact of instantiating AuthService in each request ?
        const authService = new AuthService();

        const tokenInfo = await authService.checkSession(token);

        if (tokenInfo == false) {
            return res.status(401).json({message: 'Authentication failed'})
        }

        req.body.companyId = tokenInfo.companyId;
        req.body.userId = tokenInfo.userId;

        //TEMP: future update: set the tokens in the responsive header (if the tokens are updated)
        next();
        return;
    } catch (error) {
        //TEMP: in prod, only sends 401 Authentication failed
        return res.status(500).json({error});
    }
}