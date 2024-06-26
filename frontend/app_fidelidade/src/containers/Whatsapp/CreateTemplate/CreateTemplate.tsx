'use client'
//external dependencies
import { useState, useRef } from "react"
import { useFormState, useFormStatus } from "react-dom";

//internal dependencies
import { CreateTemplateContainer } from "./styled"
import { createWhatsappTemplate, createWhatsappTemplateProps } from "@/services/ServerActions/Facebook";

function TemplateComponentContentt() {
    const [componentContent, setComponentContent] = useState<string>('');
    const contentRef = useRef<HTMLTextAreaElement>(null);

    function insertVariable(variable: string, event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault(); //Prevent form submission

        if (contentRef.current) {
            const input = contentRef.current;
            const startPosition = input.selectionStart;
            const endPosition = input.selectionEnd;

            //Insert the text at the current cursor position or replace the selected text
            const newContent = componentContent.substring(0, startPosition) + variable + componentContent.substring(endPosition);
            setComponentContent(newContent);

            setTimeout(() => {
                input.selectionStart = input.selectionEnd = startPosition + variable.length;
                input.focus();
            }, 0);
        }
    }

    return (
        <div>
            <div>
                <button onClick={(event) => insertVariable('{{points}}', event)}>Pontos</button>
                <button onClick={(event) => insertVariable('{{target}}', event)}>Alvo</button>
            </div>
            <textarea name='templateContent' ref={contentRef} rows={10} cols={50} value={componentContent} onChange={(e) => setComponentContent(e.target.value)} placeholder="Texto do corpo" />
        </div>
    )
}

interface CreateTemplateFormContentProps {
    formState: createWhatsappTemplateProps
}
function CreateTemplateFormContent({formState}: CreateTemplateFormContentProps) {
    const [templateName, setTemplateName] = useState('');
    const [templateCategory, setTemplateCategory] = useState('MARKETING');
    const [templateHeaderType, setTemplateHeaderType] = useState('None');
    const [templateHeaderContent, setTemplateHeaderContent] = useState('');
    const {pending} = useFormStatus();

    function handleTemplateNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = event.target.value;

        // Replace uppercase letters with lowercase and spaces with underscores
        inputValue = inputValue.replace(/[A-Z]/g, (match) => match.toLowerCase());
        inputValue = inputValue.replace(/ /g, '_');
    
        // Remove invalid characters
        inputValue = inputValue.replace(/[^a-z0-9_]/g, '');
    
        setTemplateName(inputValue);
    }

    return (
        <>
            {!pending && formState.success != null && formState.message != '' ? <p style={formState.success ? {color: 'green'} : {color: 'red'}}>{formState.message}</p> : ''}
            <div className="formItem">
                Nome do template: <input type='text' name='templateName' value={templateName} onChange={handleTemplateNameChange}/>
            </div>

            <div className="formItem">
                Categoria:
                {/*TEMP: names of the categories in portuguese for the user ?*/}
                <select name='templateCategory' value={templateCategory} onChange={(event) => setTemplateCategory(event.target.value)}>
                    <option value='MARKETING'>MARKETING</option>
                    <option value='UTILITY'>UTILITY</option>
                </select>
            </div>

            <div className="formItem">
                Cabeçalho (head):
                <select name='templateHeaderType' value={templateHeaderType} onChange={(event) => setTemplateHeaderType(event.target.value)}>
                    <option value='None'>Nenhum</option>
                    <option value='Text'>Texto</option>
                </select>
                {templateHeaderType == 'Text' ? <input type='text' name='templateHeaderContent'  value={templateHeaderContent} onChange={(event) => setTemplateHeaderContent(event.target.value)} placeholder="Texto do cabeçalho" /> : ''}
            </div>
            
            <div className="formItem">
                Corpo (body): <TemplateComponentContentt/>
            </div>
            
            <div className="formButton">
                <button type="submit" disabled={pending}>Criar</button>
            </div>
        </>
    )
}

export default function CreateTemplate() {
    const [formState, formAction] = useFormState(createWhatsappTemplate, {success: null, message: ''});

    return (
        <CreateTemplateContainer>
            <div className="containerTitle">
                <p>Criar Templates</p>
            </div>
            <form className="templateForm" action={formAction}>
                <CreateTemplateFormContent formState={formState}/>
            </form>
        </CreateTemplateContainer>
    )
}