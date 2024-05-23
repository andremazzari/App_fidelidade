'use client'
//external dependencies
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { getFidelityInfo, getFidelityInfoProps } from "@/services/ServerActions/Fidelity";
import Utils from "@/utils/Utils";

interface RedeemFidelitySearchFormContentProps {
    formState: getFidelityInfoProps
    setPhone: React.Dispatch<React.SetStateAction<number | null>>
    setTarget: React.Dispatch<React.SetStateAction<number | null>>
    setPoints: React.Dispatch<React.SetStateAction<number | null>>
}
function RedeemFidelitySearchFormContent({formState, setPhone, setPoints, setTarget}: RedeemFidelitySearchFormContentProps) {
    const {pending} = useFormStatus();

    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [unformattedPhoneNumber, setUnformattedPhoneNumber] = useState('');

    useEffect(() => {
        if (formState.success && formState.target != undefined && formState.points != undefined) {
            setPhone(parseInt(unformattedPhoneNumber));
            setTarget(formState.target);
            setPoints(formState.points);
        }
    }, [formState]);

    return (
        <>
            {formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            <div>
                <label htmlFor="formattedPhone">
                    Buscar telefone: 
                </label>
                +55 <input type="tel" id='formattedPhone' name='formattedPhone' value={formattedPhoneNumber} onChange={(event) => Utils.handlePhoneNumberChange(event, setUnformattedPhoneNumber, setFormattedPhoneNumber)}/>
                <input type='hidden' name='phone' value={unformattedPhoneNumber}/>
            </div>
            <button type="submit" disabled={pending}>Buscar</button>
        </>
    )
}


interface RedeemFidelitySearchFormProps {
    setPhone: React.Dispatch<React.SetStateAction<number | null>>
    setTarget: React.Dispatch<React.SetStateAction<number | null>>
    setPoints: React.Dispatch<React.SetStateAction<number | null>>
}
export default function RedeemFidelitySearchForm({setPhone, setTarget, setPoints}: RedeemFidelitySearchFormProps) {
    const [formState, formAction] = useFormState(getFidelityInfo, {success: false, message: '', parityUpdate: false});

    return (
        <form action={formAction}>
            <RedeemFidelitySearchFormContent formState={formState} setPhone={setPhone} setTarget={setTarget} setPoints={setPoints}/>
        </form>
    )
}