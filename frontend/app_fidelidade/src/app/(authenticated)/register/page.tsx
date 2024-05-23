//internal dependencies
import { RegisterPageContainer, FormContainer } from "./styled"
import FidelityForm from "@/components/forms/FidelityForm/FidelityForm"

export default function Page() {
    return (
        <RegisterPageContainer>
            <FormContainer>
                <FidelityForm/>
            </FormContainer> 
        </RegisterPageContainer>
    )
}