//internal dependencies
import { LoginContainer } from "../styled"
import SignInForm from "@/components/forms/SignInForm/SignInForm"

export default function SignIn() {
    return (
        <LoginContainer>
            <h2>Entre com sua conta</h2>
            <SignInForm/>
            <br/>
        </LoginContainer>
    )
}