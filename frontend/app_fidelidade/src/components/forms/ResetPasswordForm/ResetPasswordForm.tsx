'use client'
//external dependencies
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { resetPassword, resetPasswordProps } from "@/services/ServerActions/Authentication";

interface ResetPasswordFormContentProps {
    token: string
    userId: string
    formState: resetPasswordProps
}
function ResetPasswordFormContent({token, userId, formState}: ResetPasswordFormContentProps) {
    const {pending} = useFormStatus();

    if (formState.display == true && token != '' && userId != '') {
        return (
            <>
            {formState.success != null && formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            <label htmlFor="password">Nova senha:</label>
            <input type="password" name='password' id='password' required/>
            <label htmlFor="confirmPassword">Confirme a nova senha:</label>
            <input type="password" name="confirmPassword" id='confirmPassword' required/>
            <input type='hidden' name="token" value={token}/>
            <input type='hidden' name="userId" value={userId}/>
            <button>Alterar senha</button>
            </>
        )
    } else {
        return (
            <>
            {formState.success != null && formState.message != '' && !pending && <p style={formState.success ? {color:'green'} : {color:'red'}}>{formState.message}</p>}
            </>
        )
    } 
}

export default function ResetPasswordForm() {
    const [formState, formAction] = useFormState(resetPassword, {success: null, message:'', display: true});
    const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setToken(queryParams.get('token') || '');
        setUserId(queryParams.get('userId') || '');
    }, []);

    return (
        <form action={formAction}>
            <ResetPasswordFormContent token={token} userId={userId} formState={formState} />
        </form>
    )
}