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
    whatsapp_message_enabled?: boolean
    whatsapp_template_id?: string
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
    registerFidelity(phone: number, userId: string): Promise<any>;
    getRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any>;
    deleteFidelityRecord(userId: string, phone: number, timestamp: string): Promise<string>;
    getRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number>;
    getFidelityInfo(userId: string, phone: number): Promise<FidelityInfo>;
    updateFidelityConfig(userId: string, config: FidelityConfig): Promise<boolean>;
    getFidelityConfig(userId: string): Promise<any>;
    redeemFidelity(userId: string, phone: number): Promise<FidelityInfo>;
    getRedeemRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRedeemRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>
}

export interface IFidelityRepository {
    registerFidelity(phone: number, userId: string): Promise<string>;
    getRecords(userId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any>;
    deleteFidelityRecord(userId: string, phone: number, timestamp: string): Promise<string>;
    getRecordsCount(userId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number>;
    countPoints(userId: string, phone: number, initialDate?: string, endDate?: string): Promise<number>;
    getOlderTarget(userId: string, phone: number): Promise<number | null>;
    createFidelityConfig(userId: string): Promise<void>;
    updateFidelityConfig(userId: string, config: FidelityConfig): Promise<boolean>;
    getFidelityConfig(userId: string, columns?: string): Promise<any>;
    redeemFidelity(userId: string, phone: number, target: number): Promise<void>;
    getRedeemRecords(userId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRedeemRecordsCount(userId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>;
}