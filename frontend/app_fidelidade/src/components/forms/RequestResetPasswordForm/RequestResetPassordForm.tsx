'use client'
//external dependencies
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { requestResetPassword, requestResetPasswordProps } from "@/services/ServerActions/Authentication";


interface ResetPasswordFormContentProps {
    formState: requestResetPasswordProps
}
function ResetPasswordFormContent({formState}: ResetPasswordFormContentProps) {
    const {pending} = useFormStatus();

    return (
        <>
            {formState.success != null && formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" required/>
            <button type="submit" disabled={pending}>Esqueci a senha</button>
        </>
    )
}

export default function RequestResetPasswordForm() {
    const [formState, formAction] = useFormState(requestResetPassword, {success: null, message:''});

    return (
        <form action={formAction}>
            <ResetPasswordFormContent formState={formState}/>
        </form>
    )
}