//external dependencies
import { Request, Response } from "express";

//---------------------------------------
// DATA MODELS
//---------------------------------------

export interface FidelityInfo {
    points: number
    target: number
}

export interface FidelityConfig {
    target?: number | string
    whatsappMessageEnabled?: boolean
    whatsappTemplateId?: string
}

//---------------------------------------
// CLASS MODELS
//---------------------------------------

//TEMP: define the return interface of the services and repositories

export interface IFidelityController {
    registerFidelity(req: Request, res: Response): Promise<Response>;
    getRecords(req: Request, res: Response): Promise<Response>;
    deleteFidelityRecord(req: Request, res: Response): Promise<Response>;
    getRecordsCountPages(req: Request, res: Response): Promise<Response>;
    getFidelityInfo(req: Request, res: Response): Promise<Response>;
    updateFidelityConfig(req: Request, res: Response): Promise<Response>;
    getFidelityConfig(req: Request, res: Response): Promise<Response>;
    redeemFidelity(req: Request, res: Response): Promise<Response>;
    getRedeemRecords(req: Request, res: Response): Promise<Response>;
}

export interface IFidelityService {
    registerFidelity(companyId: string, userId: string, phone: number, points: number): Promise<any>;
    getRecords(companyId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any>;
    deleteFidelityRecord(companyId: string, userId: string, phone: number, timestamp: string): Promise<string>;
    getRecordsCountPages(companyId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number>;
    getFidelityInfo(companyId: string, phone: number): Promise<FidelityInfo>;
    getFidelityConfig(companyId: string): Promise<any>;
    updateFidelityConfig(companyId: string, config: FidelityConfig): Promise<boolean>;
    redeemFidelity(companyId: string, userId: string, phone: number): Promise<FidelityInfo>;
    getRedeemRecords(companyId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRedeemRecordsCountPages(companyId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>
}

export interface IFidelityRepository {
    registerFidelity(companyId: string, userId: string, phone: number, points: number): Promise<string>;
    getRecords(companyId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any>;
    deleteFidelityRecord(companyId: string, userId: string, phone: number, timestamp: string): Promise<string>;
    getRecordsCount(companyId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number>;
    countPoints(companyId: string, phone: number, initialDate?: string, endDate?: string): Promise<number>;
    getOlderTarget(companyId: string, phone: number): Promise<number | null>;
    createFidelityConfig(companyId: string): Promise<void>;
    getFidelityConfig(companyId: string, columns?: string): Promise<any>;
    updateFidelityConfig(companyId: string, config: FidelityConfig): Promise<boolean>;
    redeemFidelity(companyId: string, userId: string, phone: number, target: number): Promise<void>;
    getRedeemRecords(companyId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRedeemRecordsCount(companyId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>;
}