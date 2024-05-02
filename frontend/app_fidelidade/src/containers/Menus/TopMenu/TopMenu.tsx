//internal dependencies
import { TopMenuContainer } from "./styled";
import LogoutButton from "@/components/buttons/Logout/Logout";

function TopMenu() {
    return (
        <TopMenuContainer>
            <LogoutButton/>
        </TopMenuContainer>
    )
}

export default TopMenu;