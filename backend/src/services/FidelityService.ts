//internal dependencies
import { json } from "stream/consumers";
import { IFidelityService, IFidelityRepository, FidelityInfo, FidelityConfig } from "../models/Fidelity";
import { IFacebookService } from "../models/Facebook";

class FidelityService implements IFidelityService {
    constructor(
        private facebookService: IFacebookService,
        private fidelityRepository: IFidelityRepository
    ) {}

    async registerFidelity(companyId: string, userId: string, phone: number, points: number): Promise<any> {
        //TEMP: review errors and return types
        try {
            const createdAt = await this.fidelityRepository.registerFidelity(companyId, userId, phone, points);

            //If enabled, notify user via whatsapp.
            const config = await this.fidelityRepository.getFidelityConfig(companyId);
            
            if (config.whatsappMessageEnabled) {
                //send whatsapp message
                //get current points and target
                const {target, points} = await this.getFidelityInfo(companyId, phone);

                const result = await this.facebookService.sendFidelityWhatsappMessage(companyId, phone, createdAt, points, target);
            }

            return {status: 201, json: {}}
        } catch (error) {
            throw error;
        }
    }

    async getRecords(companyId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any> {
        //TEMP: review errors and return types
        try {
            const offset = (pageNumber - 1) * pageSize
            const records = await this.fidelityRepository.getRecords(companyId, offset, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            const pages = await this.getRecordsCountPages(companyId, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            return {pages, records}
        } catch (error) {
            throw error;
        }
    }

    async deleteFidelityRecord(companyId: string, userId: string, phone: number, timestamp: string): Promise<string> {
        try {
            const result = await this.fidelityRepository.deleteFidelityRecord(companyId, userId, phone, timestamp);

            //Should the client be notified via whatsapp message ?
            return result
        } catch(error) {
            throw error
        }
    }

    async getRecordsCountPages(companyId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number> {
        //TEMP: review errors and return types
        try {
            const totalCount = await this.fidelityRepository.getRecordsCount(companyId, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            const pages = Math.ceil(totalCount / pageSize); 

            return pages
        } catch (error) {
            throw error;
        }
    }

    async getFidelityInfo(companyId: string, phone: number): Promise<FidelityInfo> {
        try {
            //Get target for this phone
            let target = await this.fidelityRepository.getOlderTarget(companyId, phone);

            if (target == null) {
                //get current target
                //TEMP: treat errors
                const currentFidelityConfig = await this.fidelityRepository.getFidelityConfig(companyId);
                target = currentFidelityConfig.target as number;
            }

            //Get quantity of records for this phone
            let points = await this.fidelityRepository.countPoints(companyId, phone);

            return {target, points}
        } catch (error) {
            throw error;
        }
    }

    async getFidelityConfig(companyId: string): Promise<any> {
        try {
            return await this.fidelityRepository.getFidelityConfig(companyId);
        } catch (error) {
            throw error
        } 
    }

    async updateFidelityConfig(companyId: string, config: FidelityConfig): Promise<boolean> {
        try {
            return await this.fidelityRepository.updateFidelityConfig(companyId, config);
        } catch (error) {
            throw error
        } 
    }

    async redeemFidelity(companyId: string, userId: string, phone: number): Promise<FidelityInfo> {
        try {
            const {target, points} = await this.getFidelityInfo(companyId, phone);

            if (points >= target) {
                //redeem points
                await this.fidelityRepository.redeemFidelity(companyId, userId, phone, target);

                //get updated values for points and target
                const newValues = await this.getFidelityInfo(companyId, phone);

                return {points: newValues.points, target: newValues.target}
            } else {
                //error: not enough points
                //TEMP: how should I treat this error ?
                throw new Error('Not enough points');
            }
        } catch (error) {
            throw error
        }
    }

    async getRedeemRecords(companyId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any> {
        try {
            const offset = (pageNumber - 1) * pageSize
            const records = await this.fidelityRepository.getRedeemRecords(companyId, offset, pageSize, phone, initialDate, endDate);

            const pages = await this.getRedeemRecordsCountPages(companyId, pageSize, phone, initialDate, endDate);

            return {pages, records}
        } catch (error) {
            throw error;
        }
    }

    async getRedeemRecordsCountPages(companyId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number> {
        //TEMP: review errors and return types
        try {
            const totalCount = await this.fidelityRepository.getRedeemRecordsCount(companyId, phone, initialDate, endDate);

            const pages = Math.ceil(totalCount / pageSize); 

            return pages
        } catch (error) {
            throw error;
        }
    }
}

export default FidelityService;