//internal dependencies
import { LoginContainer } from "../styled"
import SignUpForm from "@/components/forms/SignUpForm/SignUpForm"

export default function SignUp() {
    return (
        <LoginContainer>
            <h2>Cadastre-se</h2>
            <SignUpForm/>
        </LoginContainer>
    )
}

