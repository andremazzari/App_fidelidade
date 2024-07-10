//internal dependencies
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";

class LoginRequests {
    static async submitLoginForm(formData: FormData) {
        //TEMP: validate data with yup or zod. Encrypt data before sending ? Use env vars
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/user/login`,
            body: {email, password},
            contentType: 'form-urlencoded',
            cache: 'no-store'
        }

        try {
            const response = await RequestsUtils.send(options);
            return response;
        } catch(error) {
            //TEMP: threat this error
            throw new Error('Error in login request: ' + error);
        }
    }

    static async signUp(name: string, email: string, password: string) {
        const body = {
            name,
            email,
            password
        }

        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/user/signup`,
            body: body,
            contentType: 'form-urlencoded',
            cache: 'no-store'
        }

        try {
            const response = await RequestsUtils.send(options);
            return response;
        } catch (error) {
            //TEMP: treat this error
            throw new Error('Error in request to create user: ' + error);
        }
    }

    static async whatsappLogin(code: string) {
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/user/whatsapp/login`,
            body: {code},
            contentType: 'form-urlencoded',
            cache: 'no-store',
            setAuthHeader: true
        }

        try {
            const response = await RequestsUtils.send(options);
            return response;
        } catch (error) {
            //TEMP: treat this error
            throw new Error('Error in request to login in whatsapp: ' + error);
        }
    }
}

export default LoginRequests;
