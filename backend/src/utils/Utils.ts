//external dependencies
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Utils {
    static async encryptPassword(password: string): Promise<string> {
        //TEMP: treat errors. Use env vars
        const saltRounds = 10;
        const encryptedPassword: string = await bcrypt.hash(password, saltRounds);
        
        return encryptedPassword
    }

    static async comparePasswords(senha: string, hash: string) {
        //TEMP: FAZER O TRATAMENTO DE ERROS
        let resultado: boolean = await bcrypt.compare(senha, hash);

        return resultado;
    }

    static generateJWT(payload: Record<string, unknown>, expiresIn: string, secretKey: string = process.env.JWT_SECRET as string) {
        //TEMP: evaluate if ti is worth to implement asymmetric encryption with RSA
        const options = {
            expiresIn
        }

        //Remove iat and exp if exists
        if (payload.iat) {
            delete payload.iat;
        }

        if (payload.exp) {
            delete payload.exp;
        }

        return jwt.sign(payload, secretKey, options);
    }

    static verifyJWT(token: string, key: string = process.env.JWT_SECRET as string) {
        //TEMP: return type of error (expired or invalid)
        try {
            jwt.verify(token, key);
            return true;
        } catch (error) {
            return false;
        }
    }

    static decodeJWT(token: string, complete: boolean = false) {
        //TEMP: treat error
        return jwt.decode(token, {json: true, complete: complete}) as Record<string, unknown>;
    }

    static StringToBoolean(param: string | boolean | undefined): boolean | undefined {
        if (param === undefined) {
            return undefined;
        }

        if (param === true || param == false) {
            return param
        }

        if (param === 'true' || param === 'True' || param === '1') {
            return true;
        }

        if (param === 'false' || param === 'False' || param === '0') {
            return false;
        }

        return undefined
    }

    static isEmptyObject(obj: any) {
        return obj.constructor === Object && Object.keys(obj).length === 0;
    }

    static isRecordObject(item: any): item is Record<string, any> {
        return item !== null && typeof item === 'object' && !Array.isArray(item);
    }

    static isString(value: any): value is string {
        return typeof value === 'string';
    }

    static timestampToMySQL(milliSeconds = 0, date: Date | null =  null) {
        //TEMP: update this to use the moment-timezone library
        // Parse the input timestamp to a Date object
        if (date == null) {
            date = new Date();
        }
        
        // Extract the individual components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

        // Format the milliseconds to one decimal place
        if (milliSeconds > 0) {
            const formattedMilliseconds = milliseconds.substring(0, milliSeconds);
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${formattedMilliseconds}`;
        }
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static parseJSONString(jsonString: string | null) {
        if (jsonString == null) {
            return null
        }

        try {
            return JSON.parse(jsonString)
        } catch {
            return null
        }
    }

    static parseJSONorString(value: string | null) {
        //If string corresponds to a json, return parsed json. Else, return the string (or null).
        let parsedValue = this.parseJSONString(value);

        if (parsedValue == null && this.isString(value)) {
            return value
        }

        return parsedValue;
    }
}

export default Utils;