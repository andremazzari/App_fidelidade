'use server'
//internal dependencies
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";
import FacebookUtils from "@/utils/FacebookUtils";
import { text } from "stream/consumers";

//TEMP: Is there a better file to define this ?
export interface whatsappTemplateInfo {
    templateName: string
    templateId: string
    status: string
    category: string
    language: string
}

export interface SearchWhatsappTemplatesProps {
    message: string
    templates?: Array<whatsappTemplateInfo>
    paging?: {
        before: string,
        after: string
    }
}
export async function searchWhatsappTemplatesServerAction(prevState: SearchWhatsappTemplatesProps, formData: FormData): Promise<SearchWhatsappTemplatesProps> {
    const templateName = formData.get('templateName') as string;

    const urlParams = new URLSearchParams();
    urlParams.append('templateName', templateName);
    urlParams.append('fields', 'name,id,status,category,language');

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

        const templatesInfo = response.data.data.map((template: any) => {
            return {
                templateName: template.name,
                templateId: template.id,
                status: template.status,
                category: template.category,
                language: template.language
            } as whatsappTemplateInfo
        })

        return {message: '', templates: templatesInfo, paging}
    } catch(error) {
        //TEMP: handle this error. Return message to the front instead of throwing error
        throw new Error('Error in search whatsapp template request: ' + error);
    }
}

export interface getTemplateComponents {
    components: Array<any>
}
export async function getTemplateComponents(templateId: string) {
    const urlParams = new URLSearchParams();
    urlParams.append('templateId', templateId);
    urlParams.append('fields', 'components');

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
        }

        //TEMP: handle erros of unsupported component
        const processedTemplateComponents = FacebookUtils.processTemplateComponents(response.data.components);

        return processedTemplateComponents
    } catch(error) {
        //TEMP: handle this error
        throw new Error('Error in getting template components: ' + error);
    }
}


interface registerComponentsConfig {
    success: boolean | null
}
export async function registerComponentsConfig(prevState: registerComponentsConfig, formData: FormData): Promise<registerComponentsConfig> {
    const componentsCount = parseInt(formData.get('componentsCount') as string);

    if (isNaN(componentsCount)) {
        //TEMP: handle this error
    }

    let componentsConfig: Array<any> = []
    if (componentsCount > 0) {
        const componentsNumbers = Array.from({ length: componentsCount }, (_, index) => index + 1);

        for (const componentNumber of componentsNumbers) {
            const variablesCount = parseInt(formData.get(`component${componentNumber}VariablesCount`) as string);

            if (isNaN(variablesCount)) {
                //TEMP: handle this error
            }

            let parameters: Array<any> = []
            const variablesNumbers = Array.from({ length: variablesCount }, (_, index) => index + 1);
            
            for (const variableNumber of variablesNumbers) {
                //TEMP: in the future, support other types of variables.
                const variableConfig: any = {
                    type: 'text'
                }
                const variableValueType = formData.get(`component${componentNumber}Variable${variableNumber}`) as string;
                
                switch (variableValueType) {
                    case 'points':
                        variableConfig.text = '{{points}}'
                        break;
                    case 'target':
                        variableConfig.text = '{{target}}'
                        break;
                    case 'text':
                        const variableText = formData.get(`component${componentNumber}Variable${variableNumber}Text`) as string;
                        if (variableText == '{{points}}' || variableText == '{{target}}') {
                            //TEMP: return some error
                        }

                        variableConfig.text = variableText;
                        break;                        
                }

                parameters.push(variableConfig);
            }

            componentsConfig.push({
                type: formData.get(`component${componentNumber}Type`) as string,
                parameters
            })
        }
    }

    const body = {
        templateId: formData.get('templateId') as string,
        templateName: formData.get('templateName') as string,
        templateLanguage: formData.get('templateLanguage') as string,
        templateStatus: formData.get('templateStatus') as string,
        templateCategory: formData.get('templateCategory') as string,
        componentsConfig: JSON.stringify(componentsConfig)
    }

    const options: sendProps = {
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/whatsapp/templates/registered`,
        body: body,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    try {
        const response = await RequestsUtils.send(options);

        if (response.status != 200) {
            //TEMP: handle this error
            console.log(response)
        }

        return {success: true}
    } catch(error) {
        //TEMP: handle this error
        return {success: false}
    }
}

export interface setSelectedWhatsappTemplateProps {
    success: boolean | null
    message: string
    templateId?: string
}
export async function setSelectedWhatsappTemplate(prevState: setSelectedWhatsappTemplateProps, formData: FormData): Promise<setSelectedWhatsappTemplateProps> {
    const selectedTemplateId = formData.get('selectedTemplate') as string;

    if (selectedTemplateId == '') {
        return {success: false, message: 'Selecione um template.'}
    }

    const config = {
        whatsappTemplateId: selectedTemplateId
    }

    const options: sendProps = {
        method: 'PUT',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/config`,
        body: {config: JSON.stringify(config)},
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }
    
    const response = await RequestsUtils.send(options);

    if (response.status == 204) {
        return {success: true, message:'Template atualizado com sucesso.'};
    } else {
        console.log(response)
        return {success: false, message: 'Erro para atualizar template.'}
    }
}

export interface createWhatsappTemplateProps {
    success: boolean | null
    message: string
}
export async function createWhatsappTemplate(prevState: createWhatsappTemplateProps, formData: FormData): Promise<createWhatsappTemplateProps> {
    //TEMP: validate the input to verify if there are no variables {{n}} in it.
    //TEMP: support more types of components
    const components: Array<any> = []

    if (formData.get('templateHeaderType') == 'Text') {
        components.push({
            type: 'HEADER',
            format: 'TEXT',
            text: formData.get('templateHeaderContent')
        })
    }

    components.push(
        {
            type: 'BODY',
            text: formData.get('templateContent')
        }
    )

    const body = {
        templateName: formData.get('templateName'),
        templateCategory: formData.get('templateCategory'),
        components: JSON.stringify(components)
    }

    const options: sendProps = {
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/whatsapp/templates`,
        contentType: 'form-urlencoded',
        body,
        cache: 'no-store',
        setAuthHeader: true
    }

    try {
        const response = await RequestsUtils.send(options);
        console.log(response)
        if (response.status != 200) {
            //TEMP: handle this error
            return {success: false, message: 'Erro ao criar template.'}
        }

        return {success: true, message: 'Template criado com sucesso.'}
    } catch(error) {
        //TEMP: handle this error
        console.log(error)
        return {success: false, message: 'Erro ao criar template.'}
    }
    
}