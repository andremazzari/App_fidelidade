//internal dependencies
import RequestsUtils, { sendProps } from "@/utils/RequestUtils";
import Utils from "@/utils/Utils";

class RecordHistoryRequests {
    static async getRecords(pageNumber: number, pageSize: number, phone?: number, initialDate?: string, endDate?: string, excludeRedeemed?: boolean, includeCanceled?: boolean, tag?: string) {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity?pageNumber=${pageNumber}&pageSize=${pageSize}`;

        if (phone != undefined) {
            url += `&phone=${phone}`;
        }

        if (initialDate != undefined && endDate != undefined) {
            url += `&initialDate=${initialDate}&endDate=${endDate}`;
        }

        if (excludeRedeemed == true) {
            url += `&excludeRedeemed=1`;
        }

        if (includeCanceled == true) {
            url += `&includeCanceled=1`;
        }

        
        const options: sendProps = {
            method: 'GET',
            url: url,
            contentType: 'form-urlencoded',
            cache: 'no-store',
            setAuthHeader: true
        }

        if (tag != undefined) {
            options.tags =[tag];
            options.cache = 'force-cache';
        }
    
        return await RequestsUtils.send(options);
    }

    static async deleteFidelityRecord(phone: number, timestamp: string) {
        //verify if the timestmp is in the right format
        if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d$/.test(timestamp)) {
            timestamp = Utils.formatTimestampToMySQL(timestamp);
        }

        const options: sendProps = {
            method: 'DELETE',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity`,
            contentType: 'form-urlencoded',
            body: {phone, timestamp},
            cache: 'no-store',
            setAuthHeader: true
        }

        return await RequestsUtils.send(options);
    }

    static async getRedeemRecords(pageNumber: number, pageSize: number, phone?: number, initialDate?: string, endDate?: string, tag?: string) {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/redeem?pageNumber=${pageNumber}&pageSize=${pageSize}`;

        if (phone != undefined) {
            url += `&phone=${phone}`;
        }

        if (initialDate != undefined && endDate != undefined) {
            url += `&initialDate=${initialDate}&endDate=${endDate}`;
        }


        const options: sendProps = {
            method: 'GET',
            url: url,
            contentType: 'form-urlencoded',
            cache: 'no-store',
            setAuthHeader: true
        }

        if (tag != undefined) {
            options.tags =[tag];
            options.cache = 'force-cache';
        }
    
        return await RequestsUtils.send(options);
    }
}

export default RecordHistoryRequests;