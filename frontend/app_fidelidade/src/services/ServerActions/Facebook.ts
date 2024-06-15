'use server'
//internal dependencies
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";

export interface SearchWhatsappTemplatesProps {
    message: string
    templates?: any
    paging?: {
        before: string,
        after: string
    }
}
export async function SearchWhatsappTemplatesServerAction(prevState: SearchWhatsappTemplatesProps, formData: FormData): Promise<SearchWhatsappTemplatesProps> {
    const templateName = formData.get('templateName') as string;

    const urlParams = new URLSearchParams();
    urlParams.append('templateName', templateName);

    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/whatsapp/templates?` + urlParams.toString(),
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    try {
        const response = await RequestsUtils.send(options);

        if (response.status != 200) {
            //TEMP: handle this error
            console.log(response)
            return {message: 'Erro para obter templates.'}
        }

        const paging = {
            before: response.data.paging.cursors.before,
            after: response.data.paging.cursors.after
        }

        return {message: '', templates: response.data.data, paging}
    } catch(error) {
        //TEMP: handle this error
        throw new Error('Error in search whatsapp template request: ' + error);
    }
}