'use client'
//external dependencies
import { useState, ChangeEvent, FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { FidelityConfigForm } from "./styled";
import { updateFidelityConfig, UpdateFidelityConfigFormProps } from "@/services/ServerActions/Fidelity";

interface FidelityConfigFormContentProps {
    formState: UpdateFidelityConfigFormProps
    config: configFields
}

function FidelityConfigFormContent({formState, config}: FidelityConfigFormContentProps) {
    //TEMP: only allow to enable whatsapp messages if it is logged in whatsapp account (with everything ok). Otherwise, should error message.
    const {pending} = useFormStatus();

    const [fidelityTargetFilter, setFidelityTargetFilter] = useState(config.target);
    const [whatsappMessageFilter, setWhatsappMessageFilter] = useState(config.whatsappMessageEnabled);

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
                Quantidade de pontos: <input id="fidelityTargetInput" name="target" type="text" value={fidelityTargetFilter} onChange={(event) => handleFidelityTargetChange(event)} pattern="\d*" inputMode="numeric" maxLength={3}/>
            </div>
            <div>
                Notificações de whatsapp ativadas: <input type='checkbox' id='whatsappMessageEnabled' name='whatsappMessageEnabled' checked={whatsappMessageFilter} onChange={() => setWhatsappMessageFilter(!whatsappMessageFilter)}/>
            </div>
            <button type="submit" disabled={pending}>Atualizar</button>
        </>
    )
}

export interface configFields {
    target: string
    whatsappMessageEnabled: boolean
}

interface FidelityConfigProps {
    config:configFields
}

export default function FidelityConfig({config}: FidelityConfigProps) {
    const [formState, formAction] = useFormState(updateFidelityConfig, {success: false, message: ''});

    return (
        <FidelityConfigForm action={formAction}>
            <FidelityConfigFormContent formState={formState} config={config}/>
        </FidelityConfigForm>
    )
}