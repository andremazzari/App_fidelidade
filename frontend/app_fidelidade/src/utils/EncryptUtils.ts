//°xternal dependencies
import jwt from "jsonwebtoken";

class EnccryptUtils {
    static verifyJWT(token: string, key: string = process.env.JWT_PUBLIC_KEY_EMAIL_VERIFICATION as string) {
        //TEMP: return type of error (expired or invalid)
        try {
            jwt.verify(token, key);
            return true;
        } catch (error) {
            return false;
        }
    }
}

export default EnccryptUtils