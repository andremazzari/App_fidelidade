//external dependencies
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class MySQLClient {
    //TEMP: implement connection pool
    private connection: mysql.Connection | null = null;

    constructor() {
        this.createConnection();
    }

    private async createConnection(): Promise<void> {
        try {
            
            const connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST,
                port: parseInt(process.env.MYSQL_PORT as string),
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE
            })
            
            this.connection = connection;
            console.log('Connection with mysql created!')
        } catch (error) {
            //TEMP: handle this error
            console.error('Error in creating connection with mysql:' + error);
            throw error;
        }
    }

    closeConnection() {
        if (this.connection) {
            this.connection.end();
        }
    }

    async selectQuery(sqlQuery: string, parameters?: Array<string | number>) {
        try {
            if (this.connection == null) {
                throw new Error('Error connecting to mysql server');
            }
            
            if (parameters) {
                const [rows, fields] = await this.connection.execute(sqlQuery, parameters);

                return rows;
            } else {
                const [rows, fields] = await this.connection.query(sqlQuery);
                
                return rows;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async insertQuery(sqlQuery: string, parameters?: Array<string | number | null>) {
        try {
            if (this.connection == null) {
                throw new Error('Error connecting to mysql server');
            }
            
            if (parameters) {
                const [result, fields] = await this.connection.execute(sqlQuery, parameters);

                return result;
            } else {
                const [result, fields] = await this.connection.query(sqlQuery);
                
                return result;
            }  
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async updateQuery(sqlQuery: string, parameters?: Array<string | number | null>) {
        try {
            if (this.connection == null) {
                throw new Error('Error connecting to mysql server');
            }
            
            if (parameters) {
                const [result, fields] = await this.connection.execute(sqlQuery, parameters);

                return result;
            } else {
                const [result, fields] = await this.connection.query(sqlQuery);
                
                return result;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async callProcedure(sqlQuery: string, parameters?: Array<string | number | null>) {
        try {
            if (this.connection == null) {
                throw new Error('Error connecting to mysql server');
            }
            
            if (parameters) {
                const [result, fields] = await this.connection.execute(sqlQuery, parameters);

                return result;
            } else {
                const [result, fields] = await this.connection.execute(sqlQuery);
                
                return result;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export const mysqlClient = new MySQLClient()