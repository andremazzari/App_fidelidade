'use client'
//external dependencies
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { RedeemFidelityContainer } from "./styled"
import RedeemFidelitySearchForm from "@/components/forms/RedeemFidelitySearchForm/RedeemFidelitySearchForm"
import Utils from "@/utils/Utils";
import { redeemPoints, redeemPointsProps } from "@/services/ServerActions/Fidelity";

interface RedeemFidelityFormContentProps {
    formState: redeemPointsProps
    isRedeemEnabled: boolean
    phone: number | null
    setTarget: React.Dispatch<React.SetStateAction<number | null>>
    setPoints: React.Dispatch<React.SetStateAction<number | null>>
}
function RedeemFidelityFormContent({formState, isRedeemEnabled, phone, setTarget, setPoints}: RedeemFidelityFormContentProps) {
    const {pending} = useFormStatus();

    useEffect(() => {
        if (formState.points != undefined && formState.target != undefined) {
            setTarget(formState.target);
            setPoints(formState.points);
        }
    }, [formState])

    return (
        <>
            <button type="submit" disabled={!isRedeemEnabled && !pending}>Resgatar</button>
            <input type='hidden' name='phone' value={phone ? phone : ''}/>
            {formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
        </>
    )
}

export default function RedeemFidelity() {
    const [phone, setPhone] = useState<number | null>(null);
    const [target, setTarget] = useState<number | null>(null);
    const [points, setPoints] = useState<number | null>(null);
    const [isRedeemEnabled, setIsRedeemEnabled] = useState(false);

    const [formState, formAction] = useFormState(redeemPoints, {success: false, message: ''});

    useEffect(() => {
        if (points != null && target != null && points >= target) {
            setIsRedeemEnabled(true)
        } else {
            setIsRedeemEnabled(false);
        }
    }, [points, target]);

    return (
        <RedeemFidelityContainer>
            <RedeemFidelitySearchForm setPhone={setPhone} setTarget={setTarget} setPoints={setPoints}/>

            <div>
                <p>Telefone: {phone ? Utils.formatPhone(phone) : ''}</p>
                <p>Pontos: {target != undefined && points != undefined ? points + '/' + target : ''}</p>
            </div>

            <form action={formAction}>
                <RedeemFidelityFormContent formState={formState} phone={phone} isRedeemEnabled={isRedeemEnabled} setPoints={setPoints} setTarget={setTarget}/>
            </form>
        </RedeemFidelityContainer>
    )
}