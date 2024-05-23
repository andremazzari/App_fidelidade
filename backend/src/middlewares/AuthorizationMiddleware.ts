//external dependencies
import { Request, Response, NextFunction } from "express";

//internal dependencies


export async function registerAuthorization(req: Request, res: Response, next: NextFunction) {
    //TEMP: in the future, verify if the user id is associated with the store id, and if the user has authorization for the action.
    next();
}