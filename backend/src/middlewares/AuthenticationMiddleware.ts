//external dependencies
import { Request, Response, NextFunction } from "express";

//internal dependencies
import { AuthenticationTokenSchema } from "../schemas/AuthenticationSchema";
import AuthenticationSchemas from "../schemas/AuthenticationSchema";
import Utils from "../utils/Utils";

export async function AuthenticationMiddleware(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    
    try {
        await AuthenticationSchemas.token().validate({authorization});
        //await AuthenticationTokenSchema.validate({authorization});

        const token = authorization!.split(' ')[1];

        if (Utils.verifyJWT(token)) {
            //TEMP: future update: set the tokens in the responsive header (if the tokens are updated)
            //set user id in request's body
            const decodedToken = Utils.decodeJWT(token);
            req.body.userId = decodedToken.id;

            next();
            return;
        } else {
            res.status(401).json({message: 'Authentication failed'});
        }
    } catch (error) {
        //TEMP: in prod, only sends 401 Authentication failed
        res.status(400).json({error});
    }
}