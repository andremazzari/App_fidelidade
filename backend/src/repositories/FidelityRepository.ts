//internal dependencies
import { IFidelityRepository, FidelityConfig } from "../models/Fidelity";
import { mysqlClient } from "../connectors/MySQL";
import { ResultSetHeader } from "mysql2";
import Utils from "../utils/Utils";

class FidelityRepository implements IFidelityRepository {
    async registerFidelity(phone: number, userId: string): Promise<string> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.fidelity_history (id, phone, points, target, created_at)
        VALUES (UUID_TO_BIN(?, TRUE), ?, 1, (SELECT target FROM ${process.env.MYSQL_DATABASE as string}.fidelity_config WHERE id = UUID_TO_BIN(?, TRUE)), ?)
        `;
        const timestamp = Utils.currentTimestampToMySQL(1);
        const parameters = [userId, phone, userId, timestamp];

        try {
            await mysqlClient.insertQuery(sql, parameters);
            
            return timestamp
        } catch (error) {
            //TEMP: handle this error
            throw error
        }
    }

    async getRecords(userId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<any> {
        //TEMP: validate offset and pageSize againts sql injection
        let sql = `
        SELECT
            phone,
            created_at,
            redeemed_at,
            canceled_at
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            `;
        const parameters: Array<string | number> = [userId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)'

            parameters.push(initialDate);
            parameters.push(endDate);
        }

        if (excludeRedeemed) {
            sql += ' AND redeemed_at IS NULL'
        }

        if (includeCanceled == undefined || includeCanceled == false) {
            sql += ' AND canceled_at IS NULL'
        }

        sql += `
        ORDER BY
            created_at DESC
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

    async deleteFidelityRecord(userId: string, phone: number, timestamp: string): Promise<string> {
        //Only records that have not been redeemed can be deleted.
        const sql = `
        CALL CancelPoints(?,?,?)
        `;

        const parameters = [userId, phone, timestamp];
        try {
            //TEMP: it is necessary to use the selectQuery for this stored procedure because the last execution of this procedure is an selecte statment that return some values.
            const result = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            const row = result[0][0]

            if (row.affected_rows == 1) {
                return row.canceled_at;
            } else if (row.affected_rows == 0) {
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

    async getRecordsCount(userId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined, excludeRedeemed?: boolean | undefined, includeCanceled?: boolean | undefined): Promise<number> {
        let sql = `
        SELECT
            count(*) as count
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            `;
        const parameters: Array<string | number> = [userId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }

        if (excludeRedeemed) {
            sql += ' AND redeemed_at IS NULL'
        }

        if (includeCanceled == undefined || includeCanceled == false) {
            sql += ' AND canceled_at IS NULL'
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

    async countPoints(userId: string, phone: number, initialDate?: string, endDate?: string): Promise<number> {
        let sql = `
        SELECT
            sum(points) as points
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND redeemed_at IS NULL
            AND canceled_at IS NULL`;

        const parameters: Array<string | number> = [userId, phone];

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)'
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

    async getOlderTarget(userId: string, phone: number): Promise<number | null> {
        const sql = `
        SELECT
            target
        FROM
            ${process.env.MYSQL_DATABASE as string}.fidelity_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)
            AND phone = ?
            AND redeemed_at IS NULL
            AND canceled_at IS NULL
        ORDER BY
            created_at ASC
        LIMIT 1
        `;

        const parameters = [userId, phone];

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

    async createFidelityConfig(userId: string): Promise<void> {
        const defaultTarget = 10; //TEMP: should this default be in the table definition ?
        const defaultWhatsappMessageEnabled = false;
        const sql = `
            INSERT INTO ${process.env.MYSQL_DATABASE as string}.fidelity_config (id, target, whatsapp_message_enabled)
            VALUES (UUID_TO_BIN(?, TRUE), ?, ?)
        `;

        const parameters = [userId, defaultTarget, defaultWhatsappMessageEnabled];

        try {
            await mysqlClient.insertQuery(sql, parameters)
        } catch (error) {
            throw error;
        }
    }

    async getFidelityConfig(userId: string, fields?: string): Promise<any> {
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
            id = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [userId]

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

    async updateFidelityConfig(userId: string, config: FidelityConfig): Promise<boolean> {
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
        WHERE id = UUID_TO_BIN(?, TRUE) 
        `;
        parameters.push(userId)
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
    
    async redeemFidelity(userId: string, phone: number, target: number): Promise<void> {
        //TEMP: For now, this function only works if each record values 1 point.
        const sql = `CALL RedeemPoints(?,?,?)`;

        const parameters = [userId, phone, target];

        try {
            const result = await mysqlClient.callProcedure(sql, parameters) as ResultSetHeader;
            
        } catch (error) {

            throw error;
        }
    }

    async getRedeemRecords(userId: string, offset: number, pageSize: number, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<any> {
        //TEMP: validate offset and pageSize againts sql injection
        let sql = `
        SELECT
            phone,
            points,
            created_at
        FROM
            ${process.env.MYSQL_DATABASE as string}.redeem_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)`;
        const parameters: Array<string | number> = [userId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)'
            parameters.push(initialDate);
            parameters.push(endDate);
        }

        sql += `
        ORDER BY
            created_at DESC
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

    async getRedeemRecordsCount(userId: string, phone: number | undefined, initialDate: string | undefined, endDate: string | undefined): Promise<number> {
        let sql = `
        SELECT
            count(*) as count
        FROM
            ${process.env.MYSQL_DATABASE as string}.redeem_history
        WHERE
            id = UUID_TO_BIN(?, TRUE)`;
        const parameters: Array<string | number> = [userId];

        if (phone !== undefined) {
            sql += ' AND phone = ?'
            parameters.push(phone);
        }

        if (initialDate !== undefined && endDate !== undefined) {
            sql += ' AND created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)'
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