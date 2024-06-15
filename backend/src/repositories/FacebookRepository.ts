//internal dependencies
import { IFacebookRepository, WABAInfo } from "../models/Facebook";
import { mysqlClient } from "../connectors/MySQL";

class FacebookRepository implements IFacebookRepository {
    async getWhatsappInfo(userId: string, fields: Array<string> = ['token', 'token_expires_at', 'fb_user_id', 'waba_id', 'waba_name', 'phone_id', 'phone_number', 'phone_name', 'phone_verification_status']): Promise<any> {
        //Build string of columns that will be included in the sql query
        let selectColumns: string = '';
        let first = true;

        for (const column of fields) {
            if (first == true) {
                selectColumns = column
                first = false
            } else {
                selectColumns += ', ' + column
            }
        }

        const sql = `
        SELECT
            ${selectColumns}
        FROM
            ${process.env.MYSQL_DATABASE as string}.user_whatsapp
        WHERE
            id = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [userId];
        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0]
            } else if (result.length == 0) {
                return {}
            } else {
                //TEMP: handle this error (log)
                throw new Error('More than one user found')
            }
        } catch (error) {
            throw error
        }
    }

    async upsertWhatsappInfo(userId: string, token: string, debugToken: any, wabaInfo: WABAInfo): Promise<void> {
        //If a regsitry for the user already exists, update only the information regarding the token
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.user_whatsapp (id, token, token_expires_at, fb_user_id, waba_id, waba_name, phone_id, phone_number, phone_name, phone_verification_status)
        VALUES (UUID_TO_BIN(?, TRUE), ?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            token = VALUES(token),
            token_expires_at = VALUES(token_expires_at);
        `;

        const parameters = [userId, token, debugToken.data.expires_at, debugToken.data.user_id, wabaInfo.wabaId, wabaInfo.wabaName, wabaInfo.phoneId, wabaInfo.phoneNumber, wabaInfo.phoneName, wabaInfo.phoneVerificationStatus];

        try {
            const result = await mysqlClient.insertQuery(sql, parameters);
            console.log(result)
        } catch (error) {
            throw error
        }
    }

    async updateFidelityWhatsappMessageID(userId: string, phone: number, createdAt: string, wamid: string): Promise<void> {
        const sql = `
        UPDATE ${process.env.MYSQL_DATABASE as string}.fidelity_history
        SET whatsapp_message_id = ?
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND created_at = ?
        `;

        const parameters = [wamid, userId, phone, createdAt];

        try {
            await mysqlClient.updateQuery(sql, parameters);
        } catch (error) {
            throw error
        }
    }

    async getWhatsappTemplateComponentsConfig(userId: string, templateId: string): Promise<string | null> {
        const sql = `
        SELECT
            components_config
        FROM
            ${process.env.MYSQL_DATABASE as string}.whatsapp_templates
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            AND template_id = ?
        `;

        const parameters = [userId, templateId];
        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0].components_config
            } else if (result.length == 0) {
                return null
            } else {
                //TEMP: handle this error (log)
                throw new Error('More than one template found')
            }
        } catch (error) {
            throw error
        }
    }

    async getWhatsappTemplateInfo(userId: string, templateId: string): Promise<any> {
        const sql = `
        SELECT
            template_name,
            language_code,
            components_config
        FROM
            ${process.env.MYSQL_DATABASE as string}.whatsapp_templates
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            AND template_id = ?
        `;

        const parameters = [userId, templateId];
        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0]
            } else if (result.length == 0) {
                return null
            } else {
                //TEMP: handle this error (log)
                throw new Error('More than one template found')
            }
        } catch (error) {
            throw error
        }
    }
}

export default FacebookRepository