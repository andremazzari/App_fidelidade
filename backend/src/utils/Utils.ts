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

    static StringToBoolean(param: string | undefined): boolean | undefined {
        if (param === undefined) {
            return undefined;
        }

        if (param === 'true' || param === 'True' || param === '1') {
            return true;
        }

        if (param === 'false' || param === 'False' || param === '0') {
            return false;
        }

        return undefined
    }
}

export default Utils;