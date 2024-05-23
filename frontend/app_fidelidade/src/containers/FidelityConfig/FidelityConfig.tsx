'use client'
//external dependencies
import { useState, ChangeEvent, FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { FidelityConfigForm } from "./styled";
import { updateFidelityConfig, UpdateFidelityConfigFormProps } from "@/services/ServerActions/Fidelity";

interface FidelityConfigFormContentProps {
    formState: UpdateFidelityConfigFormProps
    initialTarget: string
}

function FidelityConfigFormContent({formState, initialTarget}: FidelityConfigFormContentProps) {
    const {pending} = useFormStatus();

    const [fidelityTargetFilter, setFidelityTargetFilter] = useState(initialTarget);

    function handleFidelityTargetChange(event: ChangeEvent<HTMLInputElement>) {
        const newTarget = event.target.value;

        if (/^\d+$/.test(newTarget) || newTarget == '') {
            setFidelityTargetFilter(newTarget);
        }
    }

    return (
        <>
            {formState.message != '' && !pending ? <p style={formState.success ? {color: 'green'} : {color: 'red'}}>{formState.message}</p> : ''}
            <div>
                Quantidade de pontos: <input id="fidelityTargetInput" name="fidelityTarget" type="text" value={fidelityTargetFilter} onChange={(event) => handleFidelityTargetChange(event)} pattern="\d*" inputMode="numeric" maxLength={3}/>
            </div>
            <button type="submit" disabled={pending}>Atualizar</button>
        </>
    )
}

interface FidelityConfigProps {
    initialTarget: string
}

export default function FidelityConfig({initialTarget}: FidelityConfigProps) {
    const [formState, formAction] = useFormState(updateFidelityConfig, {success: false, message: ''});

    return (
        <FidelityConfigForm action={formAction}>
            <FidelityConfigFormContent formState={formState} initialTarget={initialTarget}/>
        </FidelityConfigForm>
    )
}