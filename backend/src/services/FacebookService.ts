//internal dependencies
import { IFacebookService, IFacebookRepository, FacebookLoginToken, FacebookAPIError, WABAInfo } from "../models/Facebook";
import FacebookUtils from "../utils/FacebookUtil";
import WhatsappTemplate from "../utils/WhatsappTemplate";
import { IFidelityRepository } from "../models/Fidelity";

//TEMP: Should I create a Requests class to make the http requests ?
class FacebookService implements IFacebookService {
    constructor(
        private facebookRepository: IFacebookRepository,
        private fidelityRepository: IFidelityRepository
    ) {}

    async getAccessToken(code: string): Promise<FacebookLoginToken | FacebookAPIError> {
        const params_token = new URLSearchParams();
        params_token.append('client_id', process.env.FACEBOOK_APP_CLIENT_ID ?? '');
        params_token.append('redirect_uri', process.env.FACEBOOK_LOGIN_REDIRECT_URI ?? '');
        params_token.append('client_secret', process.env.FACEBOOK_APP_CLIENT_SECRET ?? '');
        params_token.append('code', code);
        
        const url = `${FacebookUtils.baseUrl()}/oauth/access_token?` + params_token.toString();
        
        const response = await fetch(url, {method: 'GET'});
        const data: any = await response.json();
        
        if (data.error) {
            //Error in the request
            return {errorCode: data.error.code as number} as FacebookAPIError
        }

        return data as FacebookLoginToken
    }

    async debugToken(token: string): Promise<any> {
        const urlParams = new URLSearchParams();
        urlParams.append('input_token', token);

        const url = `${FacebookUtils.baseUrl()}/debug_token?` + urlParams.toString();

        const response = await fetch(url, {method: 'GET', headers: FacebookUtils.apiHeader(token)});
        const data: any = await response.json();
        
        if (data.error) {
            //Error in the request
            return {errorCode: data.error.code as number} as FacebookAPIError
        }

        return data
    }

    checkWhatsappPermissions(tokenPermissions: any): Array<string> {
        //This funnction uses the scopes returned in the debug_token endpoint of the facebook api
        let missingPermissions = ['whatsapp_business_management', 'whatsapp_business_messaging']

        for (const permission of tokenPermissions) {
            if (permission == 'whatsapp_business_management') {
                missingPermissions = missingPermissions.filter(item => item != 'whatsapp_business_management')
            } else if (permission == 'whatsapp_business_messaging') {
                missingPermissions = missingPermissions.filter(item => item != 'whatsapp_business_messaging')
            }
        }

        return missingPermissions;
    }

    getWABAId(granularScopes: Array<any>): string | null {
        //This funnction uses the granular_scopes returned in the debug_token endpoint of the facebook api
        let wabaId: string | null = null;

        for (const item of granularScopes) {
            if (item.scope == 'whatsapp_business_management' || item.scope == 'whatsapp_business_messaging') {
                //The first element is the ID of newest WABA to grant app whatsapp_business_management (https://developers.facebook.com/docs/whatsapp/embedded-signup/manage-accounts)
                if (item.target_ids.length > 0) {
                    wabaId = item.target_ids[0] as string;
                }
            }
        }

        return wabaId;
    }

    async getWABAInfo(wabaId: string, token: string): Promise<WABAInfo | FacebookAPIError> {
        //TEMP: if in the future it is needed more info about the phone numbers, use the ednpoint /<WABA_ID>/phone_numbers
        //TEMP: understand how to use the paging for phone_numbers info.
        const urlParams = new URLSearchParams();
        urlParams.append('fields', 'name,phone_numbers');

        const url = `${FacebookUtils.baseUrl()}/${wabaId}?` + urlParams.toString();

        const response = await fetch(url, {method: 'GET', headers: FacebookUtils.apiHeader(token)});
        const data: any = await response.json();
        
        if (data.error) {
            //Error in the request
            return {errorCode: data.error.code as number} as FacebookAPIError
        }
        let phoneInfo: any = null
        if (data.phone_numbers.data != undefined) {
            const phonesInfo: Array<any> = data.phone_numbers.data
            if (phonesInfo.length > 0) {
                phoneInfo = phonesInfo[0]
            }
        }

        //TEMP: what if the user has not registered any phone during embeeded signin ?
        if (phoneInfo == null) {
            //TEMP: define my own error interface for this case
            return {errorCode: 0} as FacebookAPIError
        }

        const wabaInfo: WABAInfo = {
            wabaId: wabaId,
            wabaName: data.name,
            phoneId: phoneInfo.id,
            phoneName: phoneInfo.verified_name,
            phoneVerificationStatus: phoneInfo.code_verification_status,
            phoneNumber: phoneInfo.display_phone_number
        }

        return wabaInfo
    }

    checkWhatsappInfoBeforeDB(token: string, debugToken: any, wabaInfo: WABAInfo): boolean {
        //Check lenghts of the values before inserting in the database
        //TEMP: decide how to handle values that not comply with the limmits. Log this value and sent alerts.
        //TEMP: Do a research to estimate these maximum values.
        let errorFlag = true;

        if (token.length > 512) {
            console.log('Token greater than permitted')
            errorFlag = false;
        }

        if (debugToken.data.user_id.length > 20) {
            console.log('Facebook user id greater than permitted')
            errorFlag = false;
        }

        if (wabaInfo.wabaName.length > 100) {
            console.log('Waba name greater than permitted')
            errorFlag = false;
        }

        if (wabaInfo.phoneId.length > 20) {
            console.log('Phone id greater than permitted')
            errorFlag = false;
        }

        if (wabaInfo.phoneNumber.length > 20) {
            console.log('Phone number greater than permitted')
            errorFlag = false;
        }

        if (wabaInfo.phoneName.length > 100) {
            console.log('Phone name greater than permitted')
            errorFlag = false;
        }

        if (wabaInfo.phoneVerificationStatus.length > 15) {
            console.log('Phone verification status greater than permitted')
            errorFlag = false;
        }

        return errorFlag;
    }

    async sendFidelityWhatsappMessage(userId: string, phone: number, createdAt: string, points: number, target: number): Promise<any> {
        const whatsappInfo = await this.facebookRepository.getWhatsappInfo(userId, ['token', 'token_expires_at', 'phone_id']);

        if (!this.checkWhatsappToken(whatsappInfo.token, whatsappInfo.token_expires_at)) {
            //TEMP: handle this to inform to the user that the token has expired
            return false
        }

        let selectedTemplateId = await this.fidelityRepository.getFidelityConfig(userId, 'whatsapp_template_id');
        selectedTemplateId = selectedTemplateId.whatsapp_template_id;
        
        if (selectedTemplateId == null) {
            //TEMP: handle this to inform the user that he must select a template
            console.log('Nenhum template selecionado.')
            return false;
        }

        //Prepare template information
        const templateConfig = new WhatsappTemplate(userId, selectedTemplateId, points, target);
        await templateConfig.prepareTemplateInfo();
        
        const url = `${FacebookUtils.baseUrl()}/${whatsappInfo.phone_id}/messages`;
        //TEMP: include the country code (+55) in the number
        const body: Record<string, any> = {
            messaging_product: 'whatsapp',
            to: '5519992484684',
            type: 'template',
            template: {
                name: templateConfig.templateName,
                language: {
                    code: templateConfig.languageCode
                }
            }
        }
        
        if (templateConfig.componentConfig != null) {
            body.template.components = templateConfig.componentConfig
        }
        
        const response = await fetch(url, {method: 'POST', body: JSON.stringify(body), headers: FacebookUtils.apiHeader(whatsappInfo.token)});
        const data: any = await response.json();
        //TEMP: handle errors (failure in sending, phone not in whatsapp, others)
        console.log(selectedTemplateId)
        console.log(data);

        if (!data.messages[0].id) {
            //TEMP: Error: wamid not present
        }

        const wamid = FacebookUtils.extractWABMID(data.messages[0].id);

        try {
            await this.facebookRepository.updateFidelityWhatsappMessageID(userId, phone, createdAt, wamid)
        } catch (error) {
            //TEMP: handle this error (message id not saved in the database)
        }
    }

    checkWhatsappToken(token: string, expiresAt: Date | string): boolean {
        const expireDate= new Date(expiresAt);
        const currentDate = new Date()

        if (currentDate < expireDate) {
            return true
        } else {
            //TEMP: invalidate the token in the database
            return false
        }
    }

    async searchWhatsappTemplate(userId: string, templateId: string | undefined, templateName: string | undefined, fields: string): Promise<any> {
        //TEMP: include the possibility of searching by id, use paging, etc.
        //temp: include the possibility of choosing the fields
        const whatsappInfo = await this.facebookRepository.getWhatsappInfo(userId, ['token', 'token_expires_at', 'waba_id']);

        if (!this.checkWhatsappToken(whatsappInfo.token, whatsappInfo.token_expires_at)) {
            //TEMP: handle this to inform to the user that the token has expired
            return false
        }

        const urlParams = new URLSearchParams();
        urlParams.append('fields', fields);

        let url: string = '';
        if (templateId !== undefined) {
            url = `${FacebookUtils.baseUrl()}/${templateId}?` + urlParams.toString();
        } else if (templateName !== undefined) {
            urlParams.append('name', templateName);
            url = `${FacebookUtils.baseUrl()}/${whatsappInfo.waba_id}/message_templates?` + urlParams.toString();
        } else {
            //TEMP: handle this error
        }
        
        const response = await fetch(url, {method: 'GET', headers: FacebookUtils.apiHeader(whatsappInfo.token)});
        const data: any = await response.json();
        
        //TEMP: handle errors
        /*
        if (data.error) {
            //Error in the request
            return {errorCode: data.error.code as number} as FacebookAPIError
        }
        */

        return data
    }

    async createWhatsappTemplate(userId: string, templateName: string, templateCategory: string, components: Array<any>): Promise<any> {
        //Send request to facebook to create the template
        const whatsappInfo = await this.facebookRepository.getWhatsappInfo(userId, ['token', 'token_expires_at', 'waba_id']);

        if (!this.checkWhatsappToken(whatsappInfo.token, whatsappInfo.token_expires_at)) {
            //TEMP: handle this to inform to the user that the token has expired
            return false
        }
        
        const url = `${FacebookUtils.baseUrl()}/${whatsappInfo.waba_id}/message_templates`;
        //TEMP: allow other languages
        const body = {
            name: templateName,
            category: templateCategory,
            allow_category_change: true,
            language: 'pt_BR',
            components: FacebookUtils.transformComponentVariablesToFacebookFormat(components)
        }
        console.log(JSON.stringify(body))
        
        const response = await fetch(url, {method: 'POST', body: JSON.stringify(body), headers: FacebookUtils.apiHeader(whatsappInfo.token)});
        const data: any = await response.json();
        console.log(data);
        if (data.error) {
            //Error in the request
            return {errorCode: data.error.code as number} as FacebookAPIError
        }
        
        //Register the template in our platform
        const componentsConfig = JSON.stringify(FacebookUtils.prepareComponentsConfig(components));
        await this.facebookRepository.upsertWhatsappTemplate(userId, data.id, templateName, 'pt_BR', data.status, data.category, componentsConfig);
    }

    async getRegisteredWhatsappTemplates(userId: string): Promise<any> {
        return await this.facebookRepository.getRegisteredWhatsappTemplates(userId);
    }

    async upsertWhatsappTemplate(userId: string, templateId: string, templateName: string, languageCode: string, templateStatus: string, templateCategory: string, componentsConfig: string): Promise<any> {
        //TEMP: should I validate here if the template belongs to the user ?
        await this.facebookRepository.upsertWhatsappTemplate(userId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig);
    }
}

export default FacebookService;