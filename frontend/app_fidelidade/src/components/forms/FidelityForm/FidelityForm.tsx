'use client'
//external dependencies
import { useState, useEffect, ChangeEvent, ClipboardEvent } from "react";
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
    const [points, setPoints] = useState('1');

    useEffect(() => {
        if (formState.success == true || formState.success == null) {
            setPoints('1');
        }
    }, [formState])

    function handlePointsChange(e: ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        // Regular expression to match non-negative integers
        if (/^\d*$/.test(value)) {
            setPoints(value);
        }
    }

    function handlePointsPaste(e: ClipboardEvent<HTMLInputElement>) {
        const pasteData = e.clipboardData.getData('Text');
        // Allow only digits in pasted data
        if (!/^\d*$/.test(pasteData)) {
          e.preventDefault();
        }
      };
    
    return (
        <>
            {formState.success != null && formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            <FormItem marginbottom="10px">
                <label htmlFor="FidelityPhone">Telefone:</label>
                <br/>
                +55 <input type="tel" id='FidelityPhone' name='formattedPhone' value={formattedPhoneNumber} onChange={(event) => Utils.handlePhoneNumberChange(event, setUnformattedPhoneNumber, setFormattedPhoneNumber)}/>
                <input type='hidden' name='phone' value={unformattedPhoneNumber}/>
            </FormItem>

            <FormItem marginbottom="10px">
                <label>Pontos:</label>
                <input type="text" name='points' value={points}  onChange={(event) => handlePointsChange(event)} onPaste={handlePointsPaste}/>
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
    const [formState, formAction] = useFormState(RegisterFidelity, {success: null, message: '', changeIndicator: false});

    return (
        <FormContainer action={formAction} method="POST">
            <FidelityFormContent formState={formState}/>
        </FormContainer>
    )
}