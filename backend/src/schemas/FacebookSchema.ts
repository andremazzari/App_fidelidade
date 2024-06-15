//external dependencies
import {object, string, ref, boolean} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------

//-------------------------------------
//VALIDATION SCHEMAS
//-------------------------------------

export const SearchWhatsappTemplateSchema = object({
    userId: string().required().uuid(),
    templateName: string().required()
}).noUnknown().strict()