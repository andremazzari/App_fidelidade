//internal dependencies
import EnccryptUtils from "@/utils/EncryptUtils";
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";

export default async function Page({searchParams}:{searchParams: { [key: string]: string | string[] | undefined }}) {
    const {token} = searchParams;

    let isEmailValidated = false;
    if (typeof token === 'string' && EnccryptUtils.verifyJWT(token, process.env.JWT_PUBLIC_KEY_EMAIL_VERIFICATION as string)) {
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.BACKEND_SERVER_ADDRESS}/user/verifyEmail`,
            cache: 'no-store',
            body: {
                verificationToken: token
            }
        }

        const response = await RequestsUtils.send(options);
        if (response.status == 200) {
            isEmailValidated = true;
        } else if (process.env.ENV = 'DEV') {
            console.log('Error in request at verifyEmail:');
            console.log(response.data);
        }
    }

    if (isEmailValidated) {
        return (
            <p>
                Email validado com sucesso.
            </p>
        )
    } else {
        return (
            <p>
                Link de verificação inválido ou expirado. Entre novamente em sua conta para gerar um novo link.
            </p>
        )
    }
}