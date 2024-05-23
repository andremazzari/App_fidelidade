//external dependencies
import { Request, Response } from "express";

//---------------------------------------
// DATA MODELS
//---------------------------------------

export interface FidelityInfo {
    points: number
    target: number
}

//---------------------------------------
// CLASS MODELS
//---------------------------------------

//TEMP: define the return interface of the services and repositories

export interface IFidelityController {
    registerFidelity(req: Request, res: Response): Promise<Response>;
    getRecords(req: Request, res: Response): Promise<Response>;
    getRecordsCountPages(req: Request, res: Response): Promise<Response>;
    getFidelityInfo(req: Request, res: Response): Promise<Response>;
    updateFidelityTarget(req: Request, res: Response): Promise<Response>;
    getFidelityConfig(req: Request, res: Response): Promise<Response>;
    redeemFidelity(req: Request, res: Response): Promise<Response>;
}

export interface IFidelityService {
    registerFidelity(phone: number, userId: string): Promise<any>;
    getRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>;
    getFidelityInfo(userId: string, phone: number): Promise<FidelityInfo>;
    updateFidelityTarget(userId: string, newTarget: number): Promise<boolean>;
    getFidelityConfig(userId: string): Promise<any>;
    redeemFidelity(userId: string, phone: number): Promise<FidelityInfo>;
}

export interface IFidelityRepository {
    registerFidelity(phone: number, userId: string): Promise<boolean>;
    getRecords(userId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any>;
    getRecordsCount(userId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number>;
    countPoints(userId: string, phone: number, initialDate?: string, endDate?: string): Promise<number>;
    getOlderTarget(userId: string, phone: number): Promise<number | null>;
    createFidelityTarget(userId: string): Promise<void>;
    updateFidelityTarget(userId: string, newTarget: number): Promise<boolean>;
    getFidelityConfig(userId: string): Promise<any>;
    redeemFidelity(userId: string, phone: number, target: number): Promise<void>;
}