//external dependencies
import {object, string, ref, boolean} from 'yup';

//-------------------------------------
//VALIDATION FUNCTIONS
//-------------------------------------

const phoneValidationRequired = string().required().matches(/^\d+$/, 'Invalid phone').test('phoneLength', 'Phone must have length between 10 and 11', (phone) => {
    if (phone.length == 10 || phone.length == 11) {
        return true;
    } else {
        return false
    }
})

const phoneValidationNotRequired = string().matches(/^\d+$/, 'Invalid phone').test('phoneLength', 'Phone must have length between 10 and 11', (phone) => {
    if (phone !== undefined) {
        if (phone.length == 10 || phone.length == 11) {
            return true;
        } else {
            return false
        }
    } else {
        return true;
    }     
})

const initialDateValidation = string().test('isDateValid', 'Invalid date format', (date) => {
    if (date !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date)
    } else {
        return true;
    }      
})

const endDateValidation = string().test('isDateValid', 'Invalid date format', (date) => {
    if (date !== undefined) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dateRegex.test(date)
    } else {
        return true;
    }  
}).test('isRangeValid', 'Final date must be equal or greater than initial date', function(endDateString) {
    const initialDateString = this.resolve(ref('initialDate')) as string | undefined;
    if (initialDateString !== undefined && endDateString !== undefined) {
        const initialDate = new Date(initialDateString);
        const endDate = new Date(endDateString);

        return endDate >= initialDate;
    } else {
        return true;
    }
})
//-------------------------------------
//VALIDATION SCHEMAS
//-------------------------------------

export const RegisterFidelitySchema = object({
    phone: phoneValidationRequired,
    userId: string().required().uuid()
}).noUnknown().strict()

export const GetRecordsSchema = object({
    userId: string().required().uuid(),
    pageNumber: string().required().matches(/^\d+$/),
    pageSize: string().required().matches(/^\d+$/),
    phone: phoneValidationNotRequired,
    initialDate: initialDateValidation,
    endDate: endDateValidation,
    excludeRedeemed: boolean(),
    includeCanceled: boolean()
}).noUnknown().strict()

export const DeleteFidelitySchema = object({
    userId: string().required().uuid(),
    phone: phoneValidationRequired,
    timestamp: string().required().test('isTiestampValid', 'Invalid timestmp', function(timestamp) {
        const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d$/;
        const isValidFormat = timestampRegex.test(timestamp);

        const isValidDate = isValidFormat && !isNaN(new Date(timestamp.replace(' ', 'T')).getTime());

        return isValidDate;
    })
}).noUnknown().strict()

export const GetRecordsCountPagesSchema = object({
    userId: string().required().uuid(),
    pageSize: string().required().matches(/^\d+$/),
    phone: phoneValidationNotRequired,
    initialDate: initialDateValidation,
    endDate: endDateValidation,
    excludeRedeemed: boolean(),
    includeCanceled: boolean()
}).noUnknown().strict()

export const GetFidelityInfoSchema = object({
    userId: string().required().uuid(),
    phone: phoneValidationRequired
}).noUnknown().strict();

export const GetFidelityConfigSchema = object({
    userId: string().required().uuid()
}).noUnknown().strict()

export const UpdateFidelityConfigSchema = object({
    userId: string().required().uuid(),
    target: string().required().matches(/^\d+$/, 'Invalid target value').test('IsTargetValid', 'Invalid target value', (target) => {
        if (target == '' || isNaN(parseInt(target))) {
            return false
        }
        
        if (parseInt(target) < 1 || parseInt(target) > 255) {
            return false;
        }

        return true;
    }),
    whatsappMessageEnabled: boolean().required()
}).noUnknown().strict()

export const RedeemFidelitySchema = object({
    userId: string().required().uuid(),
    phone: phoneValidationRequired
}).noUnknown().strict();

export const GetRedeemRecordsSchema = object({
    userId: string().required().uuid(),
    pageNumber: string().required().matches(/^\d+$/),
    pageSize: string().required().matches(/^\d+$/),
    phone: phoneValidationNotRequired,
    initialDate: initialDateValidation,
    endDate: endDateValidation
}).noUnknown().strict()