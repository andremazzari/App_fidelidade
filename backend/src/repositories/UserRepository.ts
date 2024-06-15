//internal dependencies
import { User, IUserRepository } from "../models/User";
import { mysqlClient } from "../connectors/MySQL";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";

class UserRepository implements IUserRepository {
    constructor() {}

    async getById(id_user: string): Promise<User | {}> {
        const sql = `
        SELECT
            BIN_TO_UUID(id, TRUE) as user_id,
            name,
            email
        FROM
            ${process.env.MYSQL_DATABASE as string}.users
        WHERE
            id = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [id_user];
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
            BIN_TO_UUID(id, TRUE) as user_id
        FROM
            ${process.env.MYSQL_DATABASE as string}.users
        WHERE
            email = ?
        `
        const parameters = [email]

        try {
            const result: Array<any> = await mysqlClient.selectQuery(sql, parameters) as Array<any>;
            if (result.length == 1) {
                return result[0].user_id;
            } else {
                return null;
            }
        } catch (error) {
            throw error
        }
    }

    async createUser(user: User): Promise<string> {
        const sql = `
        INSERT INTO ${process.env.MYSQL_DATABASE as string}.users (id, name, email, password_hash)
        VALUES (UUID_TO_BIN(?, TRUE), ?, ?, ?)
        `;
        
        const parameters = [user.id_user, user.name, user.email, user.password];
        try {
            const result = await mysqlClient.insertQuery(sql, parameters);
            //TEMP: verify if the insertion ocurred correctly
            return user.id_user
        } catch (error) {
            throw error
        }
    }

    async verifyEmail(userId: string, email: string): Promise<boolean> {
        //TEMP: what if the email is already verified ?
        const sql = `
        UPDATE ${process.env.MYSQL_DATABASE as string}.users SET is_email_verified = TRUE WHERE id = UUID_TO_BIN(?, TRUE)
        `;

        const parameters = [userId];
        try {
            const result = await mysqlClient.updateQuery(sql, parameters) as ResultSetHeader;
            if (result.affectedRows == 1) {
                return true;
            } else if (result.affectedRows == 0) {
                return false;
            } else {
                throw new Error('Email verification: more than one user updated.');
            }
        } catch (error) {
            throw error;
        }
    }

    async login(email: string): Promise<Record<string, string |undefined>> {
        const sql = `
        SELECT BIN_TO_UUID(id, TRUE) as id_user, convert(password_hash, CHAR) as password_hash from ${process.env.MYSQL_DATABASE as string}.users where email = ?
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