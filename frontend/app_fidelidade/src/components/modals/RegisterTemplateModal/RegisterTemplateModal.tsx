'use client'
//external dependencies
import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import Modal from "../Modal";
import {registerComponentsConfig, whatsappTemplateInfo } from "@/services/ServerActions/Facebook";

interface ComponentVariableInputProps {
    variableNumber: number
    componentNumber: number
}
function ComponentVariableInput({variableNumber, componentNumber}: ComponentVariableInputProps) {
    const [selectedValue, setSelectedValue] = useState('points')

    return (
        <li>
            <span>Variável {variableNumber}:</span>
            <select name={'component' + componentNumber + 'Variable' + variableNumber} value={selectedValue} onChange={(event) => setSelectedValue(event.target.value)}>
                <option value='points'>Pontos</option>
                <option value='target'>Alvo</option>
                <option value='text'>Texto</option>
            </select>
            {selectedValue == 'text' ? <input name={'component' + componentNumber + 'Variable' + variableNumber + 'Text'}></input> : ''}
        </li>
    )
}

interface TemplateComponentSectionProps {
    component: any
    componentNumber: number
}
function TemplateComponentSection({component, componentNumber}: TemplateComponentSectionProps) {
    //TEMP: in the future, send also the component.text (or equivalent for other types of components)
    let title = ''
    switch (component.type){
        case 'header':
            title = 'Cabeçalho (header)';
            break;
        case 'body':
            title = 'Corpo (body)';
            break;
        case 'footer':
            title = 'Rodapé (footer)';
            break
    }

    const variableNumbers = Array.from({ length: component.variablesCount }, (_, index) => index + 1);
    return (
        <div>
            <h4>{title}</h4>
            <ul>
                {variableNumbers.map((variableNumber: number) => {return (
                    <ComponentVariableInput variableNumber={variableNumber} componentNumber={componentNumber}/>
                )})}
            </ul>
            <input type="hidden" name={'component' + componentNumber + 'Type'} value={component.type} />
            <input type="hidden" name={'component' + componentNumber + 'VariablesCount'} value={component.variablesCount} />
        </div>
    )
}

interface RegisterTemplateModalFormContentProps {
    templateInfo: whatsappTemplateInfo
    templateComponents: Array<any>
}
function RegisterTemplateModalFormContent({templateInfo, templateComponents}: RegisterTemplateModalFormContentProps) {
    const {pending} = useFormStatus();
    return (
        <>
            {templateComponents.length > 0 ? templateComponents.map((component: any, index: number) => {
            return(
                <TemplateComponentSection component={component} componentNumber={index + 1} />
            )
        }) : 'Este template não possui variáveis para configurar.'}
        <div>
            <input type="hidden" name='templateId' value={templateInfo.templateId}/>
            <input type="hidden" name='templateName' value={templateInfo.templateName}/>
            <input type="hidden" name='templateLanguage' value={templateInfo.language}/>
            <input type="hidden" name='componentsCount' value={templateComponents.length}/>
            <button disabled={pending}>Registar template</button>
        </div>
        </>
        
    )
}

interface RegisterTemplateModalContentProps extends RegisterTemplateModalFormContentProps {
    formAction: (payload: FormData) => void
    registerStatus: boolean | null
}
function RegisterTemplateModalContent({formAction, registerStatus, templateInfo, templateComponents}: RegisterTemplateModalContentProps) {
    if (registerStatus == true) {
        //TEMP: review this message and close the modal
        return (
                <p>Template registrado com sucesso.</p>
        )
    }

    if (registerStatus == false) {
        //TEMP: handle this error
        return (
            <p>Erro ao registrar template.</p>
        )
    }

    return (
        <form action={formAction}>
                <RegisterTemplateModalFormContent templateInfo={templateInfo} templateComponents={templateComponents}/>
        </form>
    )
}

interface RegisterTemplateModalProps {
    isModalOpen: boolean
    onClose: () => void
    templateComponents: Array<any>
    templateInfo: whatsappTemplateInfo
}
export default function RegisterTemplateModal({isModalOpen, onClose, templateComponents, templateInfo}: RegisterTemplateModalProps) {
    const [formState, formAction] = useFormState(registerComponentsConfig, {success: null});

    useEffect(() => {
        if (!isModalOpen) {
            formState.success = null;
        }
    }, [isModalOpen])


    return (
        <Modal isModalOpen={isModalOpen} onClose={onClose} width="50%" height="70%">
            <h3>Registar template {templateInfo.templateName}</h3>
            <br/>
            {isModalOpen && <RegisterTemplateModalContent formAction={formAction} registerStatus={formState.success} templateInfo={templateInfo} templateComponents={templateComponents}/>}
        </Modal>
    )
}