'use client'
//external dependencies
import { useState, useEffect } from "react"

//internal dependencies
import RegisterTemplateModal from "@/components/modals/RegisterTemplateModal/RegisterTemplateModal";
import { getTemplateComponents, whatsappTemplateInfo } from "@/services/ServerActions/Facebook";

interface RegisterTemplateProps {
    templateInfo: whatsappTemplateInfo
}
export default function RegisterTemplate({templateInfo}: RegisterTemplateProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [templateComponents, setTemplateComponents] = useState<Array<any>>([]);

    useEffect(() => {
        setIsModalOpen(false);
    }, [templateInfo])

    async function handleRegisterClick() {
        setTemplateComponents(await getTemplateComponents(templateInfo.templateId));
        setIsModalOpen(true)
    }

    return (
        <>
        <button onClick={() => handleRegisterClick()}>Registar</button>
        <RegisterTemplateModal isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} templateComponents={templateComponents} templateInfo={templateInfo} />
        </>
    )
}