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

    private static id_user_validation = string().required().uuid();

    private static user_info_validation = object({
                                                name: string().required(),
                                                email: string().required().email(),
                                                password: string().required()
                                            }).noUnknown().strict()

    //-------------------------------------
    //VALIDATION SCHEMAS
    //-------------------------------------

    static getById() {
        return object({
            id_user: this.id_user_validation
        }).noUnknown().strict()
    }

    static createUser() {
        return object({
            user_info: this.user_info_validation
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

    static login() {
        return object({
            email: string().required().email(),
            password: string().required()
        }).noUnknown().strict()
    }

    static whatsappLogin() {
        return object({
            userId: string().required().uuid(),
            code: string().required()
        }).noUnknown().strict();
    }
}

export default UserSchemas;