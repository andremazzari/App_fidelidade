import RequestsUtils, {sendProps} from "@/utils/RequestUtils";

class LoginRequests {
    static async submitLoginForm(formData: FormData) {
        //TEMP: validate data with yup or zod. Encrypt data before sending ? Use env vars
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.BACKEND_SERVER_ADDRESS as string}/user/login`,
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

    static async createUserAccount(name: string, email: string, password: string) {
        const body = {
            name,
            email,
            password
        }

        const options: sendProps = {
            method: 'POST',
            url: `${process.env.BACKEND_SERVER_ADDRESS as string}/user`,
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
}

export default LoginRequests;
