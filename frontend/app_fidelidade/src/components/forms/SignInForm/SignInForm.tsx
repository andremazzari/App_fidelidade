'use client'
//external dependencies
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { LoginButtonContainer, FormButton, FormContainer, FormItem } from "../styled"
import { Login, LoginFormStateProps } from "@/services/ServerActions/Authentication";

interface SignInFormContentProps {
    formState: LoginFormStateProps
    redirectPath: string
}
function SignInformContent({formState, redirectPath}: SignInFormContentProps) {
    const {pending} = useFormStatus();

    return (
        <>
            {formState.message != '' && !pending && <p style={{color:'red'}}>{formState.message}</p>}
            <FormItem marginbottom="10px">
                <label htmlFor="SignInEmail">Email:</label>
                <br/>
                <input type="email" id="SignInEmail" name="email"/>
            </FormItem>
            <FormItem marginbottom="20px">
                <label htmlFor="SignInPassword">Senha:</label>
                <br/>
                <input type="password" id="SignInPassword" name="password"/>
            </FormItem>

            {/*redirect parameter*/}
            <input type="hidden" name='redirectPath' value={redirectPath}/>
            
            <LoginButtonContainer>
                <FormButton type="submit" disabled={pending}>
                    Entrar
                </FormButton>
            </LoginButtonContainer>
        </>
    )
}

export default function SignInForm() {
    //TEMP: Encrypt data before sending ?
    const [redirectPath, setRedirectPath] = useState<string>('');

    const [formState, formAction] = useFormState(Login, {message:''});
    
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        setRedirectPath(queryParams.get('redirect') || '');
    }, []);

    return (
        <FormContainer action={formAction} method="POST">
            <SignInformContent formState={formState} redirectPath={redirectPath}/>   
        </FormContainer>
    )
}