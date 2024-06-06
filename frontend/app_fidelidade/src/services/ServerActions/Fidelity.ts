'use server'
//external dependencies
import { revalidateTag } from "next/cache"

//internal dependencies
import RequestsUtils, { sendProps } from "@/utils/RequestUtils"

export interface FidelityFormStateProps {
    success: boolean
    message: string
}

export async function RegisterFidelity(prevState: FidelityFormStateProps, formData: FormData) {
    try {
        const phone = formData.get('phone') as string;
        
        const options: sendProps = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity`,
            body: {phone},
            contentType: 'form-urlencoded',
            cache: 'no-store',
            setAuthHeader: true
        }

        const response = await RequestsUtils.send(options);

        if (response.status != 201) {
            //TEMP: treat types of errors
            return {success: false, message: 'Erro ao cadastrar fidelidade.'}
        } else {
            //Revalidate data in history table
            revalidateTag('registerPageRecordHistory');
            return {success: true, message: 'Fidelidade registrada com sucesso.'}
        }
    } catch (error) {
        if (process.env.ENV == 'DEV') {
            console.log('Error at RegisterFildeity:');
            console.log(error);
        }
        return {success: false, message:'Erro ao cadastrar fidelidade.'};
    }
}

export interface UpdateFidelityConfigFormProps {
    success: boolean
    message: string
}

export async function updateFidelityConfig(prevState: UpdateFidelityConfigFormProps, formData: FormData) {
    const target = formData.get('fidelityTarget') as string;

    const validationResult = validateFidelityTarget(target);

    if (!validationResult.error) {
        const options: sendProps = {
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/config`,
            body: {target},
            contentType: 'form-urlencoded',
            cache: 'no-store',
            setAuthHeader: true
        }
        
        const response = await RequestsUtils.send(options);

        if (response.status == 204) {
            return {success: true, message:'Dados atualizados com sucesso.'};
        } else {
            return {success: false, message: 'Erro para atualizar os dados.'}
        }
    } else {
        return {success: false, message: validationResult.message}
    }
}

function validateFidelityTarget(target: string) {
    if (target == '') {
        return {error: true, message:'Insira um valor para a quantidade de pontos.'};
    }

    if (!/^\d+$/.test(target)) {
        return {error: true, message:'Quantidade de pontos deve ser um valor numérico.'}
    }

    if (parseInt(target) < 1 || parseInt(target) > 255) {
        return {error: true, message:'Quantidade de pontos deve ser um número entre 1 e 255.'}
    }

    return {error: false, message:''}
}


export interface getFidelityInfoProps {
    success: boolean
    message: string
    parityUpdate: boolean
    target?: number
    points?: number
}
export async function getFidelityInfo(prevState: getFidelityInfoProps, formData: FormData): Promise<getFidelityInfoProps> {
    const phone = formData.get('phone') as string;

    //TEMP: validated phone

    const options: sendProps = {
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/info?phone=${phone}`,
        contentType: 'form-urlencoded',
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);
    
    if (response.status != 200) {
        return {success: false, message: `Erro para obter os dados.`, parityUpdate: !prevState.parityUpdate}
    }
    
    return {success: true, message: '', target: response.data.target, points: response.data.points, parityUpdate: !prevState.parityUpdate}
}

//TEMP: in the future, verify if it is possible to unify these state interfaces
export interface redeemPointsProps {
    success: boolean
    message: string
    points?: number
    target?: number
}
export async function redeemPoints(prevState: redeemPointsProps, formData: FormData): Promise<redeemPointsProps> {
    const phone = formData.get('phone') as string;

    //TEMP: validated phone

    const options: sendProps = {
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS as string}/fidelity/redeem`,
        contentType: 'form-urlencoded',
        body: {phone},
        cache: 'no-store',
        setAuthHeader: true
    }

    const response = await RequestsUtils.send(options);
    
    if (response.status != 200) {
        return {success: false, message: 'Erro para resgatar os pontos.'}
    }

    const data = response.data;

    return {success: true, message: 'Pontos resgatados com sucesso!', points: data.points, target: data.target}
}