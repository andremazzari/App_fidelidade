//external dependencies
import {object, string, ref, boolean, array} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------

//TEMP: update these component objects to support more types of templates
const createComponent = object({
    type: string().required().oneOf(['HEADER', 'BODY']),
    text: string().required(),
    format: string().oneOf(['TEXT'])
}).noUnknown().strict()

const templateComponentParameter = object({
    text: string().required(),
    type: string().oneOf(['text']).required()
}).noUnknown().strict()

const templateComponentConfig = object({
    type: string().oneOf(['body', 'header']).required(),
    parameters: array().of(templateComponentParameter).strict()
})

//-------------------------------------
//VALIDATION SCHEMAS
//-------------------------------------

export const SearchWhatsappTemplateSchema = object({
    userId: string().required().uuid(),
    templateId: string(),
    templateName: string(),
    fields: string().required()
}).test('id-or-name', 'Either templateId or templateName must be provided', (values) => {
    return !!(values.templateId || values.templateName)
}).noUnknown().strict();

export const CreateWhatsappTemplateSchema = object({
    userId: string().required().uuid(),
    templateName: string().required().test('Invalid-template-name', 'Template name can only contain lower case letters, digits and underscores', (name) => {
        const regex = /^[a-z0-9_]+$/;
        return regex.test(name);
    }),
    templateCategory: string().required().test('valid categories', 'Invalid category', (category) => {
        if (category == 'MARKETING' || category == 'UTILITY') {
            return true
        } else {
            return false
        }
    }),
    components: array().of(createComponent).required('Components field missing or invalid').min(1, 'Template must contain at least one component').strict().test('Invalid variables', 'Components should not contain substrings of the format {{n}}', (components) => {
        const variableRegex = /\{\{\d+\}\}/g;

        for (const component of components) {
            const variablesMatchs = component.text.match(variableRegex);
            const variablesCount = variablesMatchs ? variablesMatchs.length : 0;
            
            if (variablesCount > 0) {
                //TEMP: handle this error. Send back to the user this error.
                return false
            }
        }

        return true
    })
})

export const GetRegisteredWhatsappTemplates = object({
    userId: string().required().uuid()
}).noUnknown().strict()

export const UpsertWhatsappTemplateSchema = object({
    userId: string().required().uuid(),
    templateId: string().required(),
    templateName: string().required(),
    languageCode: string().required(),
    templateStatus: string().required().oneOf(['APPROVED', 'IN_APPEAL', 'PENDING', 'REJECTED', 'PENDING_DELETION', 'DELETED', 'DISABLED', 'PAUSED', 'LIMIT_EXCEEDED']),
    templateCategory: string().required().oneOf(['MARKETING', 'UTILITY']),
    componentsConfig: array().of(templateComponentConfig).nullable().min(0).strict()
}).noUnknown().strict();

class FacebookSchemas {
    //-------------------------------------
    //VALIDATION FUNCTIONS
    //-------------------------------------

    //TEMP: update these component objects to support more types of templates
    private static createComponent = object({
        type: string().required().oneOf(['HEADER', 'BODY']),
        text: string().required(),
        format: string().oneOf(['TEXT'])
    }).noUnknown().strict()

    private static templateComponentParameter = object({
        text: string().required(),
        type: string().oneOf(['text']).required()
    }).noUnknown().strict()

    private static templateComponentConfig = object({
        type: string().oneOf(['body', 'header']).required(),
        parameters: array().of(this.templateComponentParameter).strict()
    })

    //-------------------------------------
    //VALIDATION SCHEMAS
    //-------------------------------------

    static searchWhatsappTemplate() {
        return object({
            userId: string().required().uuid(),
            templateId: string(),
            templateName: string(),
            fields: string().required()
        }).test('id-or-name', 'Either templateId or templateName must be provided', (values) => {
            return !!(values.templateId || values.templateName)
        }).noUnknown().strict();
    }

    static createWhatsappTemplate() {
        return object({
            userId: string().required().uuid(),
            templateName: string().required().test('Invalid-template-name', 'Template name can only contain lower case letters, digits and underscores', (name) => {
                const regex = /^[a-z0-9_]+$/;
                return regex.test(name);
            }),
            templateCategory: string().required().test('valid categories', 'Invalid category', (category) => {
                if (category == 'MARKETING' || category == 'UTILITY') {
                    return true
                } else {
                    return false
                }
            }),
            components: array().of(this.createComponent).required('Components field missing or invalid').min(1, 'Template must contain at least one component').strict().test('Invalid variables', 'Components should not contain substrings of the format {{n}}', (components) => {
                const variableRegex = /\{\{\d+\}\}/g;
        
                for (const component of components) {
                    const variablesMatchs = component.text.match(variableRegex);
                    const variablesCount = variablesMatchs ? variablesMatchs.length : 0;
                    
                    if (variablesCount > 0) {
                        //TEMP: handle this error. Send back to the user this error.
                        return false
                    }
                }
        
                return true
            })
        })
    } 

    static getRegisteredWhatsappTemplates() {
        return object({
            userId: string().required().uuid()
        }).noUnknown().strict()
    }

    static upsertWhatsappTemplate() {
        return object({
            userId: string().required().uuid(),
            templateId: string().required(),
            templateName: string().required(),
            languageCode: string().required(),
            templateStatus: string().required().oneOf(['APPROVED', 'IN_APPEAL', 'PENDING', 'REJECTED', 'PENDING_DELETION', 'DELETED', 'DISABLED', 'PAUSED', 'LIMIT_EXCEEDED']),
            templateCategory: string().required().oneOf(['MARKETING', 'UTILITY']),
            componentsConfig: array().of(this.templateComponentConfig).nullable().min(0).strict()
        }).noUnknown().strict();
    }
}

export default FacebookSchemas