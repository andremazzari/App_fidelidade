'use client'
//external dependencies
import { useState, ChangeEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { FormContainer, FormItem, FormButtonContainer, FormButton } from "../styled"
import { RegisterFidelity, FidelityFormStateProps } from "@/services/ServerActions/Fidelity";
import Utils from "@/utils/Utils";

interface FidelityFormContentProps {
    formState: FidelityFormStateProps
}

function FidelityFormContent({formState}: FidelityFormContentProps) {
    //TEMP: validate the phone number format before sending request
    const {pending} = useFormStatus();

    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [unformattedPhoneNumber, setUnformattedPhoneNumber] = useState('');

    
    return (
        <>
            {formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            <FormItem marginbottom="10px">
                <label htmlFor="FidelityPhone">Telefone:</label>
                <br/>
                +55 <input type="tel" id='FidelityPhone' name='formattedPhone' value={formattedPhoneNumber} onChange={(event) => Utils.handlePhoneNumberChange(event, setUnformattedPhoneNumber, setFormattedPhoneNumber)}/>
                <input type='hidden' name='phone' value={unformattedPhoneNumber}/>
            </FormItem>

            <FormButtonContainer>
                <FormButton type="submit" disabled={pending}>
                    Enviar
                </FormButton>
            </FormButtonContainer>
        </>
    )
}

export default function FidelityForm() {
    const [formState, formAction] = useFormState(RegisterFidelity, {success: false, message: ''});

    return (
        <FormContainer action={formAction} method="POST">
            <FidelityFormContent formState={formState}/>
        </FormContainer>
    )
}