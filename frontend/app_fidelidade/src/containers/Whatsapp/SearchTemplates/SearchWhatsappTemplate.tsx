'use client'
//external dependencies
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { SearchWhatsappTemplateContainer } from "./styled";
import { searchWhatsappTemplatesServerAction, whatsappTemplateInfo } from "@/services/ServerActions/Facebook";
import RegisterTemplate from "@/components/buttons/RegisterTemplate/RegisterTemplate";



interface WhatsappTemplateItemProps {
    templateInfo: whatsappTemplateInfo
}
function WhatsappTemplateItem({templateInfo}: WhatsappTemplateItemProps) {
    return (
        <li className="templateItem">
            <div className="templateItemInfo">
                <div>
                    <p>{templateInfo.templateName} ({templateInfo.status})</p>
                </div>
                <div>
                    <p>id: {templateInfo.templateId} - categoria: {templateInfo.category}</p>
                </div>
            </div>

            <div className="templateItemButtonContainer">
                <RegisterTemplate templateInfo={templateInfo}/>
            </div>
        </li>
    )
}

function SearchWhatsappTemplatesFormContent() {
    const {pending} = useFormStatus();

    return (
        <>
        Nome do template:<input name='templateName' type='text'></input>
        <button type='submit' disabled={pending}>Buscar</button>
        </>
    )
}


export default function SearchWhatsappTemplates() {
    const [formState, formAction] = useFormState(searchWhatsappTemplatesServerAction, {message: ''});

    return (
        <SearchWhatsappTemplateContainer>
            <form className="searchForm" action={formAction}>
                <SearchWhatsappTemplatesFormContent/>
            </form>

            <ul className="templateList">
                {formState.templates ? formState.templates.map((template: any) => <WhatsappTemplateItem templateInfo={template} />) : ''}
            </ul>
        </SearchWhatsappTemplateContainer>
    );
}