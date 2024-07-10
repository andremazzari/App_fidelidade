//internal dependencies
import { IFidelityRepository, FidelityConfig } from "../models/Fidelity";
import { mysqlClient } from "../connectors/MySQL";
import { ResultSetHeader } from "mysql2";
import Utils from "../utils/Utils";

class FidelityRepository implements IFidelityRepository {
    async registerFidelity(companyId: string, userId: string, phone: number, points: number): Promise<string> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.fidelity_history (companyId, phone, points, target, createdAt, createdBy)
        VALUES (UUID_TO_BIN(?, TRUE), ?, ?, (SELECT target FROM ${process.env.MYSQL_DATABASE as string}.fidelity_config WHERE companyId = UUID_TO_BIN(?, TRUE)), ?, UUID_TO_BIN(?, TRUE))
        `;
        const timestamp = Utils.timestampToMySQL(1);
        const parameters = [companyId, phone, points, companyId, timestamp, userId];

        try {
            await mysqlClient.insertQuery(sql, parameters);
            
            return timestamp
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }

    async getRecords(companyId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any> {
        //TEMP: validate offset and pageSize againts sql injection
        let sql = `
        SELECT
            phone,
            createdAt,
            points,
            redeemedAt,
            canceledAt
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            `;
        const parameters: Array<string | number> = [companyId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND createdAt >= ? AND createdAt < DATE_ADD(?, INTERVAL 1 DAY)'

            parameters.push(initialDate);
            parameters.push(endDate);
        }

        if (excludeRedeemed) {
            sql += ' AND redeemedAt IS NULL'
        }

        if (includeCanceled == undefined || includeCanceled == false) {
            sql += ' AND canceledAt IS NULL'
        }

        sql += `
        ORDER BY
            createdAt DESC,
            fidelityId DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
        `;
        
        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;

            return result;
        } catch (error) {
            throw error
        }
    }

    async deleteFidelityRecord(companyId: string, userId: string, phone: number, timestamp: string): Promise<string> {
        //Only records that have not been redeemed can be deleted.
        const sql = `
        CALL CancelPoints(?,?,?,?)
        `;

        const parameters = [companyId, userId, phone, timestamp];
        try {
            //TEMP: it is necessary to use the selectQuery for this stored procedure because the last execution of this procedure is an selecte statment that return some values.
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            const row = result[0][0]

            if (row.affectedRows == 1) {
                return row.canceledAt;
            } else if (row.affectedRows == 0) {
                //TEMP: send this error in the route. It is possible that the record exists but has already been redeemed. How to treat this ?
                throw new Error('Not found');
            } else {
                //TEMP: How should I send this error in the route ? Should I ?
                throw new Error('More than one record deleted.');
            }
        } catch (error) {
            throw error
        }
    }

    async getRecordsCount(companyId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number> {
        let sql = `
        SELECT
            count(*) as count
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            `;
        const parameters: Array<string | number> = [companyId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND createdAt >= ? AND createdAt < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }

        if (excludeRedeemed) {
            sql += ' AND redeemedAt IS NULL'
        }

        if (includeCanceled == undefined || includeCanceled == false) {
            sql += ' AND canceledAt IS NULL'
        }
        
        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;

            if (result.length == 1) {
                return result[0].count;
            } else {
                throw new Error('Error in counting record history.');
            }
        } catch (error) {
            throw error
        }
    }

    async countPoints(companyId: string, phone: number, initialDate?: string, endDate?: string): Promise<number> {
        let sql = `
        SELECT
            sum(points) as points
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND redeemedAt IS NULL
            AND canceledAt IS NULL`;

        const parameters: Array<string | number> = [companyId, phone];

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND createdAt >= ? AND createdAt < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }
        
        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            
            if (result.length == 1) {
                return result[0].points == null ? 0 : parseInt(result[0].points);
            }

            return 0
        } catch (error) {
            throw error
        }
    }

    async getOlderTarget(companyId: string, phone: number): Promise<number | null> {
        const sql = `
        SELECT
            target
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND redeemedAt IS NULL
            AND canceledAt IS NULL
        ORDER BY
            createdAt ASC
        LIMIT 1
        `;

        const parameters = [companyId, phone];

        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            
            if (result.length == 0) {
                return null
            } else {
                return parseInt(result[0].target);
            }
        } catch (error) {
            throw error;
        }
    }

    async createFidelityConfig(companyId: string): Promise<void> {
        const defaultTarget = 10; //TEMP: should this default be in the table definition ?
        const defaultWhatsappMessageEnabled = false;
        const sql = `
            INSERT INTO ${process.env.MYSQL_DATABASE as string}.fidelity_config (companyId, target, whatsappMessageEnabled)
            VALUES (UUID_TO_BIN(?, TRUE), ?, ?)
        `;

        const parameters = [companyId, defaultTarget, defaultWhatsappMessageEnabled];

        try {
            await mysqlClient.insertQuery(sql, parameters)
        } catch (error) {
            throw error;
        }
    }

    async getFidelityConfig(companyId: string, fields?: string): Promise<any> {
        //TEMP: if fields is included in the route, validate againts invalid input and sql injection
        let columns = '*'
        if (fields) {
            columns = fields
        }
        
        const sql = `
        SELECT
            ${columns}
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_config
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [companyId]

        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;

            if (result.length == 0) {
                //TEMP: review this error
                throw new Error('Not found')
            } else if (result.length == 1) {
                return result[0];
            } else {
                throw new Error('Error in reading fidelity config.');
            }
        } catch (error) {
            throw error
        }        
    }

    async updateFidelityConfig(companyId: string, config: FidelityConfig): Promise<boolean> {
        //TEMP: use the id of the store
        let updateStatement = '';
        const parameters: Array<any> = [];
        for (const key of Object.keys(config)) {
            if (config[key as keyof FidelityConfig] != undefined) {
                if  (updateStatement == '') {
                    updateStatement = `${key} = ?`;
                } else {
                    updateStatement += `, ${key} = ?`;
                }
                parameters.push(config[key as keyof FidelityConfig]);
            }
        }

        if (updateStatement == '' || parameters.length == 0) {
            throw new Error('No fields to update in config.')
        }

        const sql = `
        UPDATE ${process.env.MYSQL_DATABASE as string}.fidelity_config
        SET ${updateStatement}
        WHERE companyId = UUID_TO_BIN(?, TRUE) 
        `;
        parameters.push(companyId)
        try {
            const result = await mysqlClient.updateQuery(sql, parameters) as ResultSetHeader;
            if (result.affectedRows == 1) {
                return true;
            } else if (result.affectedRows == 0) {
                throw new Error('Target update failed');
            } else {
                throw new Error('Target update: more than one user updated.');
            }
        } catch (error) {
            throw error
        }
    }
    
    async redeemFidelity(companyId: string, userId: string, phone: number, target: number): Promise<void> {
        //TEMP: For now, this function only works if each record values 1 point.
        const sql = `CALL RedeemPoints(?,?,?,?)`;

        const parameters = [companyId, userId, phone, target];

        try {
            await mysqlClient.callProcedure(sql, parameters) as ResultSetHeader;
        } catch (error) {

            throw error;
        }
    }

    async getRedeemRecords(companyId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any> {
        //TEMP: validate offset and pageSize againts sql injection
        let sql = `
        SELECT
            phone,
            points,
            createdAt
        FROM
            ${process.env.MYSQL_DATABASE as string}.redeem_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)`;
        const parameters: Array<string | number> = [companyId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND createdAt >= ? AND createdAt < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }

        sql += `
        ORDER BY
            createdAt DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
        `;
        
        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;

            return result;
        } catch (error) {
            throw error
        }
    }

    async getRedeemRecordsCount(companyId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number> {
        let sql = `
        SELECT
            count(*) as count
        FROM
            ${process.env.MYSQL_DATABASE as string}.redeem_history
        WHERE
            companyId = UUID_TO_BIN(?, TRUE)`;
        const parameters: Array<string | number> = [companyId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND createdAt >= ? AND createdAt < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }
        
        try {
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;

            if (result.length == 1) {
                return result[0].count;
            } else {
                throw new Error('Error in counting redeem record history.');
            }
        } catch (error) {
            throw error
        }
    }
}

export default FidelityRepository;