//internal dependencies
import { json } from "stream/consumers";
import { IFidelityService, IFidelityRepository, FidelityInfo } from "../models/Fidelity";

class FidelityService implements IFidelityService {
    constructor(private fidelityRepository: IFidelityRepository) {}

    async registerFidelity(phone: number, userId: string): Promise<any> {
        //TEMP: review errors and return types
        try {
            const response = await this.fidelityRepository.registerFidelity(phone, userId);

            if (response) {
                return {status: 201, json: {}}
            } else {
                throw new Error('Failed to create fidelity resource.')
            }
        } catch (error) {
            throw error;
        }
    }

    async getRecords(userId: string, pageNumber: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any> {
        //TEMP: review errors and return types
        try {
            const offset = (pageNumber - 1) * pageSize
            const records = await this.fidelityRepository.getRecords(userId, offset, pageSize, phone, initialDate, endDate);

            const pages = await this.getRecordsCountPages(userId, pageSize, phone, initialDate, endDate);

            return {pages, records}
        } catch (error) {
            throw error;
        }
    }

    async getRecordsCountPages(userId: string, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number> {
        //TEMP: review errors and return types
        try {
            const totalCount = await this.fidelityRepository.getRecordsCount(userId, phone, initialDate, endDate);

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

    async updateFidelityTarget(userId: string, newTarget: number): Promise<boolean> {
        try {
            return await this.fidelityRepository.updateFidelityTarget(userId, newTarget);
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

                //TEMP: register this redeem action in a table.

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
}

export default FidelityService;