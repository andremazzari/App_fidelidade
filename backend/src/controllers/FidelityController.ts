//external dependencies
import { Request, Response } from "express";


//internal dependencies
import { IFidelityController, IFidelityService } from "../models/Fidelity";
import { RegisterFidelitySchema, GetRecordsSchema, GetRecordsCountPagesSchema, UpdateFidelityConfigSchema, GetFidelityConfigSchema, GetFidelityInfoSchema, RedeemFidelitySchema, GetRedeemRecordsSchema, DeleteFidelitySchema } from "../schemas/FidelitySchema";
import Utils from "../utils/Utils";

class FidelityController implements IFidelityController {
    constructor(private fidelityService: IFidelityService) {}

    async registerFidelity(req: Request, res: Response): Promise<Response> {
        //TEMP: include also the id of the user and the id of the store
        const {phone, userId} = req.body;

        try {
            await RegisterFidelitySchema.validate({phone, userId});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.fidelityService.registerFidelity(parseInt(phone), userId);

            return res.status(result.status).json(result.json)
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            return res.status(500).json({error})
        }
    }

    async getRecords(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const pageNumber = req.query.pageNumber as string;
        const pageSize = req.query.pageSize as string;
        let phone = req.query.phone as string | undefined;
        const initialDate = req.query.initialDate as string | undefined;
        const endDate = req.query.endDate as string | undefined;
        const excludeRedeemed = Utils.StringToBoolean(req.query.excludeRedeemed as string | undefined);
        const includeCanceled = Utils.StringToBoolean(req.query.includeCanceled as string | undefined);

        try {
            await GetRecordsSchema.validate({userId, pageNumber, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const transformedPhone = phone !== undefined ? parseInt(phone) : undefined;
            const result = await this.fidelityService.getRecords(userId, parseInt(pageNumber), parseInt(pageSize), transformedPhone, initialDate, endDate, excludeRedeemed, includeCanceled);

            return res.status(200).json(result)
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            return res.status(500).json({error})
        }
    }

    async deleteFidelityRecord(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const phone = req.body.phone;
        const timestamp = req.body.timestamp;
        
        try {
            await DeleteFidelitySchema.validate({userId, phone, timestamp});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.fidelityService.deleteFidelityRecord(userId, parseInt(phone), timestamp);

            return res.status(200).json({canceled_at: result})
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            console.log(error);
            return res.status(500).json({error})
        }
    }

    async getRecordsCountPages(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const pageSize = req.query.pageSize as string;
        let phone = req.query.phone as string;
        const initialDate = req.query.initialDate as string;
        const endDate = req.query.endDate as string;
        const excludeRedeemed = Utils.StringToBoolean(req.query.excludeRedeemed as string | undefined);
        const includeCanceled = Utils.StringToBoolean(req.query.includeCanceled as string | undefined);

        try {
            await GetRecordsCountPagesSchema.validate({userId, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const transformedPhone = phone !== undefined ? parseInt(phone) : undefined;
            const pagesNumber = await this.fidelityService.getRecordsCountPages(userId, parseInt(pageSize), transformedPhone, initialDate, endDate, excludeRedeemed, includeCanceled);

            return res.status(200).json({pages: pagesNumber});
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            return res.status(500).json({error})
        }
    }

    async getFidelityInfo(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const phone = req.query.phone as string;

        try {
            await GetFidelityInfoSchema.validate({userId, phone});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.fidelityService.getFidelityInfo(userId, parseInt(phone));

            return res.status(200).json(result);
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            return res.status(500).json({error})
        }
    }

    async getFidelityConfig(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;

        try {
            await GetFidelityConfigSchema.validate({userId});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.fidelityService.getFidelityConfig(userId);

            return res.status(200).json(result);
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here.
            //TEMP: review the error returned.
            return res.status(500).json({error})
        }
    }

    async updateFidelityConfig(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const target = req.body.target;
        const whatsappMessageEnabled = Utils.StringToBoolean(req.body.whatsappMessageEnabled as string | undefined);

        try {
            await UpdateFidelityConfigSchema.validate({userId, target, whatsappMessageEnabled});
        } catch (error) {
            return res.status(400).json({error});
        }
        
        try {
            await this.fidelityService.updateFidelityConfig(userId, target, whatsappMessageEnabled!);

            return res.status(204).json({});
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here.
            //TEMP: review the error returned.
            return res.status(500).json({error})
        }
    }

    async redeemFidelity(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const phone = req.body.phone as string;

        try {
            await RedeemFidelitySchema.validate({userId, phone});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const newFildeityInfo = await this.fidelityService.redeemFidelity(userId, parseInt(phone));

            return res.status(200).json(newFildeityInfo);
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            //TEMP: treat different kinds of errors: not enough points, not found, numbers of rows updated different from target, etc
            return res.status(500).json({error});
        }
    }


    async getRedeemRecords(req: Request, res: Response): Promise<Response> {
        //TEMP: in the future, use the id of the store.
        const userId = req.body.userId;
        const pageNumber = req.query.pageNumber as string;
        const pageSize = req.query.pageSize as string;
        let phone = req.query.phone as string;
        const initialDate = req.query.initialDate as string;
        const endDate = req.query.endDate as string;

        try {
            await GetRedeemRecordsSchema.validate({userId, pageNumber, pageSize, phone, initialDate, endDate});
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const transformedPhone = phone !== undefined ? parseInt(phone) : undefined;
            const result = await this.fidelityService.getRedeemRecords(userId, parseInt(pageNumber), parseInt(pageSize), transformedPhone, initialDate, endDate);

            return res.status(200).json(result)
        } catch (error) {
            //TEMP: in prod, do not send mysql errors here
            return res.status(500).json({error})
        }
    }
}

export default FidelityController;