//internal dependencies
import { json } from "stream/consumers";
import { IFidelityService, IFidelityRepository, FidelityInfo } from "../models/Fidelity";
import { IFacebookService } from "../models/Facebook";

class FidelityService implements IFidelityService {
    constructor(
        private facebookService: IFacebookService,
        private fidelityRepository: IFidelityRepository
    ) {}

    async registerFidelity(phone: number, userId: string): Promise<any> {
        //TEMP: review errors and return types
        try {
            const createdAt = await this.fidelityRepository.registerFidelity(phone, userId);

            //If enabled, notify user via whatsapp.
            const config = await this.fidelityRepository.getFidelityConfig(userId);
            
            if (config.whatsapp_message_enabled) {
                //send whatsapp message
                //get current points and target
                const {target, points} = await this.getFidelityInfo(userId, phone);

                const result = await this.facebookService.sendFidelityWhatsappMessage(userId, phone, createdAt, points, target);
            }

            return {status: 201, json: {}}
        } catch (error) {
            throw error;
        }
    }

    async getRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any> {
        //TEMP: review errors and return types
        try {
            const offset = (pageNumber - 1) * pageSize
            const records = await this.fidelityRepository.getRecords(userId, offset, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            const pages = await this.getRecordsCountPages(userId, pageSize, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            return {pages, records}
        } catch (error) {
            throw error;
        }
    }

    async deleteFidelityRecord(userId: string, phone: number, timestamp: string): Promise<string> {
        try {
            const result = await this.fidelityRepository.deleteFidelityRecord(userId, phone, timestamp);

            //Should the client be notified via whatsapp message ?
            return result
        } catch(error) {
            throw error
        }
    }

    async getRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number> {
        //TEMP: review errors and return types
        try {
            const totalCount = await this.fidelityRepository.getRecordsCount(userId, phone, initialDate, endDate, excludeRedeemed, includeCanceled);

            const pages = Math.ceil(totalCount / pageSize); 

            return pages
        } catch (error) {
            throw error;
        }
    }

    async getFidelityInfo(userId: string, phone: number): Promise<FidelityInfo> {
        try {
            //Get target for this phone
            let target = await this.fidelityRepository.getOlderTarget(userId, phone);

            if (target == null) {
                //get current target
                //TEMP: treat errors
                const currentFidelityConfig = await this.fidelityRepository.getFidelityConfig(userId);
                target = currentFidelityConfig.target as number;
            }

            //Get quantity of records for this phone
            let points = await this.fidelityRepository.countPoints(userId, phone);

            return {target, points}
        } catch (error) {
            throw error;
        }
    }

    async getFidelityConfig(userId: string): Promise<any> {
        try {
            return await this.fidelityRepository.getFidelityConfig(userId);
        } catch (error) {
            throw error
        } 
    }

    async updateFidelityConfig(userId: string, target: number, whatsappMessageEnabled: boolean): Promise<boolean> {
        try {
            return await this.fidelityRepository.updateFidelityConfig(userId, target, whatsappMessageEnabled);
        } catch (error) {
            throw error
        } 
    }

    async redeemFidelity(userId: string, phone: number): Promise<FidelityInfo> {
        try {
            const {target, points} = await this.getFidelityInfo(userId, phone);

            if (points >= target) {
                //redeem points
                await this.fidelityRepository.redeemFidelity(userId, phone, target);

                //get updated values for points and target
                const newValues = await this.getFidelityInfo(userId, phone);

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

    async getRedeemRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any> {
        try {
            const offset = (pageNumber - 1) * pageSize
            const records = await this.fidelityRepository.getRedeemRecords(userId, offset, pageSize, phone, initialDate, endDate);

            const pages = await this.getRedeemRecordsCountPages(userId, pageSize, phone, initialDate, endDate);

            return {pages, records}
        } catch (error) {
            throw error;
        }
    }

    async getRedeemRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number> {
        //TEMP: review errors and return types
        try {
            const totalCount = await this.fidelityRepository.getRedeemRecordsCount(userId, phone, initialDate, endDate);

            const pages = Math.ceil(totalCount / pageSize); 

            return pages
        } catch (error) {
            throw error;
        }
    }
}

export default FidelityService;