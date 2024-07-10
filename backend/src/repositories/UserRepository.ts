//internal dependencies
import { User, IUserRepository } from "../models/User";
import { mysqlClient } from "../connectors/MySQL";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

class UserRepository implements IUserRepository {
    constructor() {}

    async getById(userId: string, companyId: string): Promise<User | {}> {
        const sql = `
        SELECT
            BIN_TO_UUID(userId, TRUE) as userId,
            name,
            email
        FROM
            ${process.env.MYSQL_DATABASE as string}.users
        WHERE
            userId = UUID_TO_BIN(?, TRUE)
            AND companyId = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [userId, companyId];
        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0]
            } else {
                return {}
            }
        } catch (error) {
            throw error
        }
    }

    async verifyUserByEmail(email: string): Promise<string | null> {
        const sql = `
        SELECT
            BIN_TO_UUID(userId, TRUE) as userId
        FROM
            ${process.env.MYSQL_DATABASE as string}.users
        WHERE
            email = ?
        `
        const parameters = [email]

        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0].userId;
            } else {
                return null;
            }
        } catch (error) {
            throw error
        }
    }

    async createCompany(companyId: string): Promise<void> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.companies (companyId)
        VALUES (UUID_TO_BIN(?, TRUE))
        `;
        
        const parameters = [companyId];
        try {
            const result = await mysqlClient.insertQuery(sql, parameters);
            //TEMP: verify if the insertion ocurred correctly
        } catch (error) {
            throw error
        }
    }

    async createUser(user: User): Promise<void> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.users (userId, companyId, userType, name, email, passwordHash)
        VALUES (UUID_TO_BIN(?, TRUE), UUID_TO_BIN(?, TRUE), ?, ?, ?, ?)
        `;
        
        const parameters = [user.userId, user.companyId, user.type, user.name, user.email, user.password];
        try {
            const result = await mysqlClient.insertQuery(sql, parameters);
            //TEMP: verify if the insertion ocurred correctly
        } catch (error) {
            throw error
        }
    }

    async verifyEmail(companyId: string, userId: string): Promise<boolean> {
        //TEMP: what if the email is already verified ?
        const sql = `
        UPDATE ${process.env.MYSQL_DATABASE as string}.users SET isEmailVerified = TRUE WHERE userId = UUID_TO_BIN(?, TRUE) AND companyId = UUID_TO_BIN(?, TRUE)
        `;
        
        const parameters = [userId, companyId];
        try {
            const result = await mysqlClient.updateQuery(sql, parameters) as ResultSetHeader;
            if (result.affectedRows == 1) {
                return true;
            } else if (result.affectedRows == 0) {
                return false;
            } else {
                //TEMP: handle this error
                throw new Error('Email verification: more than one user updated.');
            }
        } catch (error) {
            throw error;
        }
    }

    async forgotPassword(userId: string, token: string, expiresAt: string): Promise<void> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.password_reset (userId, token, expiresAt)
        VALUES (UUID_TO_BIN(?, TRUE), UUID_TO_BIN(?, TRUE), ?)
        `;

        const parameters = [userId, token, expiresAt];

        try {
            const result = await mysqlClient.insertQuery(sql, parameters);
            //TEMP: verify if the insertion ocurred correctly
        } catch (error) {
            throw error
        }
    }

    async resetPassword(userId: string, token: string, password: string): Promise<void> {
        const sql = `CALL resetPassword(?,?,?)`;

        const parameters = [userId, token, password];

        try {
            await mysqlClient.callProcedure(sql, parameters);
        } catch (error) {
            throw error;
        }
    }

    async getLastResetPasswordTokenInfo(userId: string): Promise<any> {
        const sql = `
        SELECT
            BIN_TO_UUID(token, TRUE) as token,
            expiresAt,
            usedAt
        FROM
            ${process.env.MYSQL_DATABASE as string}.password_reset
        WHERE
            userId = UUID_TO_BIN(?, TRUE)
        ORDER BY
            createdAt DESC
        LIMIT 1
        `;

        const parameters = [userId];

        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0];
            } else {
                return {};
            }
        } catch (error) {
            throw error
        }
    }

    async login(email: string): Promise<Record<string, string |undefined>> {
        const sql = `
        SELECT BIN_TO_UUID(companyId, TRUE) as companyId, BIN_TO_UUID(userId, TRUE) as userId, convert(passwordHash, CHAR) as passwordHash from ${process.env.MYSQL_DATABASE as string}.users where email = ?
        `;

        const parameters = [email];
        try {
            const result: Record<string, string |undefined>[] = await mysqlClient.selectQuery(sql, parameters) as Record<string, string |undefined>[];
            if (result.length == 1) {
                return result[0];
            } else {
                return {id_user: undefined, password_hash: undefined}
            }
        } catch (error) {
            throw error;
        }
    }
}

export default UserRepository;