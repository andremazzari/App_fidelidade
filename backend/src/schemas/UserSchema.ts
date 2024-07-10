//external dependencies
import {object, string} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------

const id_user_validation = string().required().uuid();

const user_info_validation = object({
                                            name: string().required(),
                                            email: string().required().email(),
                                            password: string().required()
                                        }).noUnknown().strict()

//-------------------------------------
//VALIDATION SCHEMAS
//-------------------------------------

export const UserGetByIdSchema = object({
    id_user: id_user_validation
}).noUnknown().strict()

export const UserGetInstagramAccounts = object({
    id_user: id_user_validation
}).noUnknown().strict()

export const UserAddSchema = object({
    user_info: user_info_validation
}).noUnknown().strict()

export const UserVerifyEmail = object({
    verificationToken: string().required().test('isToken', 'Invalid token', (token) => {
        const bearerRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
    
        return bearerRegex.test(token);
    })
})

export const UserLoginSchema = object({
    email: string().required().email(),
    password: string().required()
}).noUnknown().strict()

export const UserWhatsappLogin = object({
    userId: string().required().uuid(),
    code: string().required()
}).noUnknown().strict();

class UserSchemas {
    //-------------------------------------
    //VALIDATION FUNCTIONS
    //-------------------------------------

    private static userIdValidation = string().required().uuid();

    private static userInfoValidation = object({
                                                name: string().required(),
                                                email: string().required().email(),
                                                password: string().required()
                                            }).noUnknown().strict()

    //-------------------------------------
    //VALIDATION SCHEMAS
    //-------------------------------------

    static getById() {
        return object({
            userId: this.userIdValidation,
            companyId: string().required().uuid()
        }).noUnknown().strict()
    }

    static createUser() {
        return object({
            user_info: this.userInfoValidation
        }).noUnknown().strict()
    }

    static verifyEmail() {
        return object({
            verificationToken: string().required().test('isToken', 'Invalid token', (token) => {
                const bearerRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
            
                return bearerRegex.test(token);
            })
        })
    }

    static forgotPassword() {
        return object({
            email: string().required().email()
        }).noUnknown().strict()
    }

    static resetPassword() {
        return object({
            userId: string().required().uuid(),
            token: string().required().uuid(),
            password: string().required(),
            confirmPassword: string().required()
        }).noUnknown().strict().test('equal-passwords', 'Passwords are not equal', (body) => {
            //TEMP: implement other validation on password
            if (body.password != body.confirmPassword) {
                return false
            }

            return true
        })
    }

    static login() {
        return object({
            email: string().required().email(),
            password: string().required()
        }).noUnknown().strict()
    }

    static whatsappLogin() {
        return object({
            companyId: string().required().uuid(),
            code: string().required()
        }).noUnknown().strict();
    }
}

export default UserSchemas;