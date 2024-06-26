//external dependencies
import { Request, Response } from "express";

//---------------------------------------
// DATA MODELS
//---------------------------------------

export interface FacebookAPIError {
    errorCode: number
    errorSubCode?: number
}

//TEMP: verify if this interface is the same for the different types of facebook logins
export interface FacebookLoginToken {
    access_token: string
    token_type: string
    expires_in: string
}

export interface WABAInfo {
    wabaId: string
    wabaName: string
    phoneId: string
    phoneName: string
    phoneVerificationStatus:  string
    phoneNumber: string
}

//---------------------------------------
// DATA MODELS CHECK
//---------------------------------------

export function isFacebookAPIError(item: any): item is FacebookAPIError {
    return 'errorCode' in item
}

//---------------------------------------
// CLASS MODELS
//---------------------------------------

export interface IFacebookController {
    searchWhatsappTemplate(req: Request, res: Response): Promise<Response>
    createWhatsappTemplate(req: Request, res: Response): Promise<Response>
    getRegisteredWhatsappTemplates(req: Request, res: Response): Promise<Response>
    upsertWhatsappTemplate(req: Request, res: Response): Promise<Response>
}

//TEMP: define the return interfaces
export interface IFacebookService {
    getAccessToken(code: string): Promise<FacebookLoginToken | FacebookAPIError>
    debugToken(token: string): Promise<any>
    checkWhatsappPermissions(tokenPermissions: any): Array<string>
    getWABAId(granular_scopes: Array<any>): string | null
    getWABAInfo(wabaId: string, token: string): Promise<WABAInfo | FacebookAPIError>
    checkWhatsappInfoBeforeDB(token: string, debugToken: any, wabaInfo: WABAInfo): boolean
    sendFidelityWhatsappMessage(userId: string, phone: number, createdAt: string, points: number, target: number): Promise<any>
    checkWhatsappToken(token: string, expiresAt: Date | string): boolean
    searchWhatsappTemplate(userId: string, templateId: string | undefined, templateName: string | undefined, fields: string): Promise<any>
    createWhatsappTemplate(userId: string, templateName: string, templateCategory: string, components: Array<any>): Promise<any>
    getRegisteredWhatsappTemplates(userId: string): Promise<any>
    upsertWhatsappTemplate(userId: string, templateId: string, templateName: string, languageCode: string, templateStatus: string, templateCategory: string, componentsConfig: string): Promise<any>
}

export interface IFacebookRepository {
    getWhatsappInfo(userId: string, fields?: Array<string>): Promise<any>
    upsertWhatsappInfo(userId: string, token: string, debugToken: any, wabaInfo: WABAInfo): Promise<void>
    updateFidelityWhatsappMessageID(userId: string, phone: number, createdAt: string, wamid: string): Promise<void>
    getWhatsappTemplateComponentsConfig(userId: string, templateId: string): Promise<any>
    getWhatsappTemplateInfo(userId: string, templateId: string): Promise<any>
    getRegisteredWhatsappTemplates(userId: string): Promise<any>
    upsertWhatsappTemplate(userId: string, templateId: string, templateName: string, languageCode: string, templateStatus: string, templateCategory: string, componentsConfig: string): Promise<any>
}