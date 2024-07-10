'use server'
//external dependencies
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from 'jsonwebtoken';

//internal dependencies
import LoginRequests from "../LoginRequests"
import RequestsUtils, { sendProps } from "@/utils/RequestUtils"

//form state
export interface LoginFormStateProps {
    message: string
}

export async function Login(prevState: LoginFormStateProps, formData: FormData) {
    //TEMP: review returned values. Validate imput here ?
    try {
        const response = await LoginRequests.submitLoginForm(formData);
        const status = await response.status;
        if (status == 401) {
            //user not authenticated
            return {message:'Authentication failed'}
        } else if (status == 200) {
            //user authenticated
            const data = await response.data;
            createTokenCookie(data.token);

        } else {
            //other error (400 or 500)
            throw new Error();
        }
    } catch(error) {
        //TEMP: review return type and message
        if (process.env.ENV == 'DEV') {
            console.log('Error at login at Authentication:');
            console.log(error);
        }
        return {message:'Something went wrong'};
    }

    const defaultRedirectPath = '/';
    const redirectPath = formData.get('redirectPath') as string;
    redirect(redirectPath != '' ? redirectPath : defaultRedirectPath);
}

export async function Logout(redirectFlag: boolean) {
    cookies().delete('token');
    if (redirectFlag) {
        redirect('/');
    }
}

export async function signUp(prevState: LoginFormStateProps, formData: FormData) {
    //TEMP: validate input here ?
    try {
        const name = formData.get('name') as string;
        const email =  formData.get('email') as string;
        const password = formData.get('password') as string;

        const response  = await LoginRequests.signUp(name, email, password);
        const status = await response.status;

        if (status != 201) {
            //TEMP: treat different errors
            throw new Error();
        }

        //user created. Create cookie with session token
        const data = await response.data;
        createTokenCookie(data.token);
    } catch(error) {
        if (process.env.ENV == 'DEV') {
            console.log('Error at signUp at Authentication:');
            console.log(error);
        }
        
        return {message:'Something went wrong'}
    }

    //TEMP: defined redirect path
    redirect('/');
}

export interface requestResetPasswordProps {
    success: boolean | null
    message: string
}
export async function requestResetPassword(prevState: requestResetPasswordProps, formData: FormData): Promise<requestResetPasswordProps> {
    const email = formData.get('email') as string;

    try {
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/user/forgotPassword`,
            body: {email},
            contentType: 'form-urlencoded',
            cache: 'no-store'
        }

        const response = await RequestsUtils.send(options);

        if (response.status != 200) {
            //TEMP: handle this error
            return {success: false, message:'Erro ao enviar solicitação. Tente novamente.'}
        }

        return {success: true, message: 'Email para redefinir senha enviado.'}
    } catch (error) {
        return {success: false, message:'Erro ao enviar solicitação. Tente novamente.'}
    }
}

export interface resetPasswordProps {
    success: boolean | null
    message: string
    display: boolean
}
export async function resetPassword(prevState: resetPasswordProps, formData: FormData): Promise<resetPasswordProps> {
    const userId = formData.get('userId');
    const token = formData.get('token');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    //validations
    if (token == '' || userId == '') {
        return {success: false, message: 'Requisição invalida', display: false}
    }

    if (password != confirmPassword) {
        return {success: false, message: 'Senhas devem ser iguais', display: true}
    }
    //TEMP: implement other password validations (lenght, special characters, etc)

    try {
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/user/resetPassword`,
            body: {userId, token, password, confirmPassword},
            contentType: 'form-urlencoded',
            cache: 'no-store'
        }

        const response = await RequestsUtils.send(options);

        if (response.status != 200) {
            //TEMP: handle this error
            return {success: false, message: 'Algo deu errado. Faça um novo pedido de alteração de senha.', display: false}
        }

        return {success: true, message: 'Senha alterado com sucesso.', display: false}
    } catch (error) {
        return {success: false, message: 'Algo deu errado. Faça um novo pedido de alteração de senha.', display: false}
    }

}

async function createTokenCookie(token: string) {
    const cookiesConfig = {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 24 * 7, //One week
        path: '/'
    }

    cookies().set('token', token, cookiesConfig);
}

export async function verifySession(): Promise<boolean> {
    //TEMP: add logic to verify if token is valid
    const token = cookies().get('token');
    
    if (token != undefined && token.value != '') {
        return true
    } else {
        return false
    }
}

export async function getToken(): Promise<string> {
    const sessionStatus = await verifySession()
    if (sessionStatus) {
        return cookies().get('token')!.value
    } else {
        return ''
    }
}

export async function isTokenExpired(token: string) {
    const decodedToken = await decodeJWT(token);

    if (decodedToken != null && decodedToken.exp) {
        const expirationTime = (decodedToken.exp as number) * 1000; // Convert UNIX timestamp to milliseconds
        const currentTime = Date.now();
        return currentTime > expirationTime;
    }
    return true; // If no expiration time is present, assume token is expired
}

export async function decodeJWT(token: string, complete: boolean = false) {
    //TEMP: tratar erro
    return jwt.decode(token, {json: true, complete: complete}) as Record<string, unknown>;
}

export async function whatsappLogin(code: string): Promise<boolean> {
    //TEMP: define the interface to returned errors
    const response = await LoginRequests.whatsappLogin(code);

    if (response.status != 200 || response.data.error) {
        //TEMP: treat different kind of errors
        console.log('Error in whatsapp login');
        console.log(response.data);

        return false
    }
    console.log(response.data)
    //TEMP: should I store the token in a cookie ?
    return true
}