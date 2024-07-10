//internal dependencies
import { IFacebookRepository, WABAInfo } from "../models/Facebook";
import { mysqlClient } from "../connectors/MySQL";

class FacebookRepository implements IFacebookRepository {
    async getWhatsappInfo(companyId: string, fields: Array<string> = ['token', 'tokenExpiresAt', 'fbUserId', 'wabaId', 'wabaName', 'phoneId', 'phoneNumber', 'phoneName', 'phoneVerificationStatus']): Promise<any> {
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
            ${process.env.MYSQL_DATABASE as string}.whatsapp_info
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
        `;
        
        const parameters = [companyId];
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

    async upsertWhatsappInfo(companyId: string, token: string, debugToken: any, wabaInfo: WABAInfo): Promise<void> {
        //If a regsitry for the user already exists, update only the information regarding the token
        //TEMP: what if the user changes the facebook account ? Should I use fb_user_id as a part of the key ?
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.whatsapp_info (companyId, token, tokenExpiresAt, fbUserId, wabaId, wabaName, phoneId, phoneNumber, phoneName, phoneVerificationStatus)
        VALUES (UUID_TO_BIN(?, TRUE), ?, FROM_UNIXTIME(?), ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            token = VALUES(token),
            tokenExpiresAt = VALUES(tokenExpiresAt);
        `;

        const parameters = [companyId, token, debugToken.data.expires_at, debugToken.data.user_id, wabaInfo.wabaId, wabaInfo.wabaName, wabaInfo.phoneId, wabaInfo.phoneNumber, wabaInfo.phoneName, wabaInfo.phoneVerificationStatus];

        try {
            await mysqlClient.insertQuery(sql, parameters);
        } catch (error) {
            throw error
        }
    }

    async updateFidelityWhatsappMessageID(companyId: string, phone: number, createdAt: string, wamid: string): Promise<void> {
        const sql = `
        UPDATE ${process.env.MYSQL_DATABASE as string}.fidelity_history
        SET whatsappMessageId = ?
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND createdAt = ?
        `;

        const parameters = [wamid, companyId, phone, createdAt];

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

    async getWhatsappTemplateInfo(companyId: string, templateId: string): Promise<any> {
        const sql = `
        SELECT
            templateName,
            languageCode,
            componentsConfig
        FROM
            ${process.env.MYSQL_DATABASE as string}.whatsapp_templates
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            AND templateId = ?
        `;

        const parameters = [companyId, templateId];
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

    async getRegisteredWhatsappTemplates(companyId: string): Promise<any> {
        const sql = `
        SELECT
            templateId,
            templateName,
            languageCode
        FROM
            ${process.env.MYSQL_DATABASE as string}.whatsapp_templates
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [companyId];

        try {
            return await mysqlClient.selectQuery(sql, parameters) as Array<any>;
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }

    async upsertWhatsappTemplate(companyId: string, templateId: string, templateName: string, languageCode: string, templateStatus: string, templateCategory: string, componentsConfig: string): Promise<any> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.whatsapp_templates (companyId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig)
        VALUES (UUID_TO_BIN(?, TRUE), ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            templateName = VALUES(templateName),
            templateStatus = VALUES(templateStatus),
            templateCategory = VALUES(templateCategory),
            componentsConfig = VALUES(componentsConfig)
        `;

        const parameters = [companyId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig]

        try {
            await mysqlClient.insertQuery(sql, parameters);
        } catch (error) {
            throw error
        }
    }
}

export default FacebookRepository