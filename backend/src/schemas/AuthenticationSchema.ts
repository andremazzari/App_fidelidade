//external dependencies
import {object, string} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------
const token_validation = string().required().test('isBearer', 'Invalid Bearer token', (token) => {
    const bearerRegex = /^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

    return bearerRegex.test(token);
});

//-------------------------------------
//VALIDATION SCHEMAS
//-------------------------------------


export const AuthenticationTokenSchema = object({
    authorization: token_validation
}).noUnknown().strict()

class AuthenticationSchemas {
    //-------------------------------------
    //VALIDATION FUNCTIONS
    //-------------------------------------
    private static token_validation = string().required().test('isBearer', 'Invalid Bearer token', (token) => {
        const bearerRegex = /^Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

        return bearerRegex.test(token);
    });

    //-------------------------------------
    //VALIDATION SCHEMAS
    //-------------------------------------


    static token() {
        return object({
            authorization: this.token_validation
        }).noUnknown().strict()  
    }  
}

export default AuthenticationSchemas;