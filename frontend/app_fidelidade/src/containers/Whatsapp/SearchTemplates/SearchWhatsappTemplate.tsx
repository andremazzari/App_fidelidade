'use client'
//external dependencies
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { SearchWhatsappTemplateContainer } from "./styled";
import { SearchWhatsappTemplatesServerAction } from "@/services/ServerActions/Facebook";
import RegisterTemplate from "@/components/buttons/RegisterTemplate/RegisterTemplate";

interface WhatsappTemplateItemProps {
    templateName: string
    templateId: string
    status: string
    category: string
}
function WhatsappTemplateItem({templateName, templateId, status, category}: WhatsappTemplateItemProps) {
    return (
        <li className="templateItem">
            <div className="templateItemInfo">
                <div>
                    <p>{templateName} ({status})</p>
                </div>
                <div>
                    <p>id: {templateId} - categoria: {category}</p>
                </div>
            </div>

            <div className="templateItemButtonContainer">
                <RegisterTemplate/>
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
    const [formState, formAction] = useFormState(SearchWhatsappTemplatesServerAction, {message: ''})

    useEffect(() => {
        console.log(formState)
    }, [formState])

    return (
        <SearchWhatsappTemplateContainer>
            <form className="searchForm" action={formAction}>
                <SearchWhatsappTemplatesFormContent/>
            </form>

            <ul className="templateList">
                {formState.templates ? formState.templates.map((template: any) => <WhatsappTemplateItem templateName={template.name} templateId={template.id} status={template.status} category={template.category} />) : ''}
            </ul>
        </SearchWhatsappTemplateContainer>
    );
}