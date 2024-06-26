//internal dependencies
import { PageContainer } from "./styled";
import FidelityConfig, {configFields} from "@/containers/FidelityConfig/FidelityConfig";
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";
import FacebookLogin from "@/components/buttons/FacebookLogin/FacebookLogin";
import RegisteredTemplates from "@/containers/Whatsapp/RegisteredTemplates/RegisteredTemplates";
import SearchWhatsappTemplates from "@/containers/Whatsapp/SearchTemplates/SearchWhatsappTemplate";
import { whatsappTemplateInfo } from "@/services/ServerActions/Facebook";
import CreateTemplate from "@/containers/Whatsapp/CreateTemplate/CreateTemplate";

async function fetchConfig(): Promise<configFields> {
    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/config`,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);

    if (response.status != 200) {
        //TEMP: handle this error
        console.log('Erro ao ler config')
    }

    return {
        target: response.data.target,
        whatsappMessageEnabled: response.data.whatsapp_message_enabled,
        whatsappTemplateId: response.data.whatsapp_template_id
    } as configFields;    
}

async function getRegisteredTemplates(): Promise<Array<whatsappTemplateInfo>> {
    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/whatsapp/templates/registered`,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);

    if (response.status != 200) {
        //TEMP: handle this error
        console.log('Erro ao ler templates registrados')
    }

    try {
        //TEMP: fill status and category
        const transformedTemplatesInfo = response.data.map((template: any) => {
            return {
                templateId: template.template_id,
                templateName: template.template_name,
                language: template.language_code,
                status: '',
                category: ''
            } as whatsappTemplateInfo
        })

        return transformedTemplatesInfo
    } catch (error) {
        //TEMP: handle this error
        return []
    }
}

export default async function Page() {
    const config = await fetchConfig()

    return (
        <>
            <PageContainer>
                <FidelityConfig config={config}/>
                <FacebookLogin/>
                <RegisteredTemplates templatesInfo={await getRegisteredTemplates()} selectedTemplate={config.whatsappTemplateId}/>
                <SearchWhatsappTemplates/>
                <CreateTemplate/>
            </PageContainer>
        </>
    )
}