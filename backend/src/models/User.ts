//external dependencies
import { Request, Response } from "express";

//---------------------------------------
// DATA MODELS
//---------------------------------------
export interface User {
    id_user: string,
    name: string,
    email: string,
    password: string | null
}

//TEMP: remove the authenticated
export interface LoginResult {
    authenticated: boolean,
    id?: string,
    token?: string,
    refreshToken?: string
}


//---------------------------------------
// CLASS MODELS
//---------------------------------------

//TEMP: define the interface for the return types of services and repositories
export interface IUserController {
    getById(req: Request, res: Response): Promise<Response>;
    createUser(req: Request, res: Response): Promise<Response>;
    verifyEmail(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    whatsappLogin(req: Request, res: Response): Promise<Response>;
}

export interface IUserService {
    getById(id_user: string): Promise<User | {}>;
    createUser(user: User): Promise<LoginResult>;
    verifyEmail(verificationToken: string): Promise<any>;
    login(email: string, password: string): Promise<LoginResult>;
    whatsappLogin(userId: string, code: string): Promise<any>
}

export interface IUserRepository {
    getById(id_user: string): Promise<User | {}>;
    verifyUserByEmail(email: string): Promise<string | null>;
    createUser(user: User): Promise<string>;
    verifyEmail(userId: string, email: string): Promise<boolean>;
    login(email: string): Promise<Record<string, string |undefined>>;
}