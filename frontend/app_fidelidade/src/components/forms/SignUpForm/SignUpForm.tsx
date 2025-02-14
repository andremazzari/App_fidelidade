'use client'
//external dependencies
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { FormContainer, FormItem, FormButtonContainer, FormButton } from "../styled";
import { LoginFormStateProps } from "@/services/ServerActions/Authentication";
import { signUp } from "@/services/ServerActions/Authentication";

interface SignUpFormContentProps {
    formState: LoginFormStateProps
}
function SignUpFormContent({formState}: SignUpFormContentProps) {
    const {pending} = useFormStatus();

    return (
        <>
            {formState.message != '' && !pending && <p style={{color:'red'}}>{formState.message}</p>}
            <FormItem marginbottom="10px">
                <label htmlFor="SignUpName">Nome:</label>
                <br/>
                <input type="text" id="SignUpName" name="name"/>
            </FormItem>
            <FormItem marginbottom="10px">
                <label htmlFor="SignUpEmail">Email:</label>
                <br/>
                <input type="email" id="SignUpEmail" name="email"/>
            </FormItem>
            <FormItem marginbottom="10px">
                <label htmlFor="SignUpPassword">Senha:</label>
                <br/>
                <input type="password" id="SignUpPassword" name="password"/>
            </FormItem>

            <FormButtonContainer>
                <FormButton type="submit" disabled={pending}>
                    Criar
                </FormButton>
            </FormButtonContainer>
        </>
    )
}

export default function SignUpForm() {
    //Encrypt data before sending ?

    const [formState, formAction] = useFormState(signUp, {message:''});
    return (
        <FormContainer action={formAction} method="POST">
            <SignUpFormContent formState={formState}/>
        </FormContainer>
    )
}