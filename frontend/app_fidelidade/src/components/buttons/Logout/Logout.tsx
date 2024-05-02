//internal dependencies
import { LogoutButtonContainer } from "./styled"
import { Logout } from "@/services/ServerActions/Authentication"

export default function LogoutButton() {
    //TEMP: use only button instead of form
    return (
        <form action={Logout.bind(null, true)}>
            <LogoutButtonContainer type="submit">
                Logout
            </LogoutButtonContainer>
        </form>
        
    )
}