//internal dependencies
import RequestsUtils, { sendProps } from "@/utils/RequestUtils";

class RecordHistoryRequests {
    static async getRecords(pageNumber: number, pageSize: number, phone?: number, initialDate?: string, endDate?: string) {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/getRecords?pageNumber=${pageNumber}&pageSize=${pageSize}`;

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
    
        return await RequestsUtils.send(options);
    }
}

export default RecordHistoryRequests;