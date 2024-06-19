//external dependencies
import {object, string, ref, boolean, array} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------

const templateComponentParameter = object({
    text: string().required(),
    type: string().oneOf(['text']).required()
})

const templateComponentConfig = object({
    type: string().oneOf(['body', 'header']).required(),
    parameters: array().of(templateComponentParameter)
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

export const GetRegisteredWhatsappTemplates = object({
    userId: string().required().uuid()
}).noUnknown().strict()

export const UpsertWhatsappTemplateSchema = object({
    userId: string().required().uuid(),
    templateId: string().required(),
    templateName: string().required(),
    languageCode: string().required(),
    componentsConfig: array().of(templateComponentConfig).nullable().min(0)
}).noUnknown().strict();