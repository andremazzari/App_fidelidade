'use client'
//external dependencies
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { RegisteredTemplatesComponents } from "./styled"
import { whatsappTemplateInfo, setSelectedWhatsappTemplate, setSelectedWhatsappTemplateProps } from "@/services/ServerActions/Facebook"

interface SelectWhatsappTemplateItemProps {
    templateInfo: whatsappTemplateInfo
    selectedTemplate: string
    handleTemplateChange: (templateId: string) => void
}
//TEMP: unify with the components of searchWhatsappTemplate. Include category and status.
function SelectWhatsappTemplateItem({templateInfo, selectedTemplate, handleTemplateChange}: SelectWhatsappTemplateItemProps) {
    
    return (
        <label>
            <li className="templateItem">
                <input type="radio" value={templateInfo.templateId} checked={templateInfo.templateId == selectedTemplate} onChange={() => handleTemplateChange(templateInfo.templateId)}/>
                <div>
                    <div>
                        <p>{templateInfo.templateName}</p>
                    </div>
                    <div>
                        <p>id: {templateInfo.templateId}</p>
                    </div>
                </div> 
            </li>
        </label>
    )
}


interface SelectRegisteredTemplateFormContentProps {
    templatesInfo: Array<whatsappTemplateInfo>
    formState: setSelectedWhatsappTemplateProps
    selectedTemplateId: string
}
function SelectRegisteredTemplateFormContent({templatesInfo, formState, selectedTemplateId}: SelectRegisteredTemplateFormContentProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>(selectedTemplateId);
    const {pending} = useFormStatus();

    function handleTemplateChange(templateId: string) {
        setSelectedTemplate(templateId);
    }

    return (
        <>
            {!pending && formState.success != null && formState.message != '' ? <p style={formState.success ? {color: 'green'} : {color: 'red'}}>{formState.message}</p> : ''}
            <ul className="templateList">
                {templatesInfo.map((template: whatsappTemplateInfo) => {
                    return (
                        <SelectWhatsappTemplateItem templateInfo={template} selectedTemplate={selectedTemplate} handleTemplateChange={handleTemplateChange}/>
                    )
                })}
            </ul>
            <input type="hidden" name='selectedTemplate' value={selectedTemplate} />
            <button type="submit" disabled={pending}>Atualizar</button>
        </>
        
    )
}

interface RegisteredTemplatesProps {
    templatesInfo: Array<whatsappTemplateInfo>
    selectedTemplate: string
}
export default function RegisteredTemplates({templatesInfo, selectedTemplate}: RegisteredTemplatesProps) {
    const [formState, formAction] = useFormState(setSelectedWhatsappTemplate, {success: null, message: ''});
    return (
        <RegisteredTemplatesComponents>
            <div className="containerTitle">
                <p>Templates registrados</p>
            </div>
            <form className="templateForm" action={formAction}>
                <SelectRegisteredTemplateFormContent templatesInfo={templatesInfo} formState={formState} selectedTemplateId={selectedTemplate}/>
            </form>
        </RegisteredTemplatesComponents>
    )
}