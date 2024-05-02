//internal dependencies
import SignIn from "@/containers/Login/SignIn/SignIn"
import SignUp from "@/containers/Login/SignUp/SignUp"
import { LoginPageContainer } from "./styled"

export default function Page() {
    return (
        <LoginPageContainer>
            <SignUp/>
            <SignIn/>
        </LoginPageContainer>
        
    )
}