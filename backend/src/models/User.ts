//external dependencies
import { Request, Response } from "express";

//---------------------------------------
// DATA MODELS
//---------------------------------------
export interface User {
    companyId: string,
    userId: string,
    name: string,
    email: string,
    password: string | null,
    type: 'O' | 'E'
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
    signUp(req: Request, res: Response): Promise<Response>;
    verifyEmail(req: Request, res: Response): Promise<Response>;
    forgotPassword(req: Request, res: Response): Promise<Response>;
    resetPassword(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    whatsappLogin(req: Request, res: Response): Promise<Response>;
}

export interface IUserService {
    getById(userId: string, companyId: string): Promise<User | {}>;
    signUp(user: User): Promise<LoginResult>;
    verifyEmail(verificationToken: string): Promise<any>;
    forgotPassword(email: string): Promise<boolean>;
    resetPassword(userId: string, token: string, password: string): Promise<boolean>;
    login(email: string, password: string): Promise<LoginResult>;
    whatsappLogin(companyId: string, code: string): Promise<any>
}

export interface IUserRepository {
    getById(userId: string, companyId: string): Promise<User | {}>;
    verifyUserByEmail(email: string): Promise<string | null>;
    createCompany(companyId: string): Promise<void>;
    createUser(user: User): Promise<void>;
    verifyEmail(companyId: string, userId: string): Promise<boolean>;
    forgotPassword(userId: string, token: string, expiresAt: string): Promise<void>;
    resetPassword(userId: string, token: string, password: string): Promise<void>;
    getLastResetPasswordTokenInfo(userId: string): Promise<any>;
    login(email: string): Promise<Record<string, string |undefined>>;
}