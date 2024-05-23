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

