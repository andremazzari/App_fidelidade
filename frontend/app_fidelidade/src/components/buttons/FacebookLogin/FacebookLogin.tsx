"use client"
//external dependencies
import { useState, useEffect } from "react";

//internal dependencies
import { FacebookLoginButton } from "./styled";
import RequestsUtils, {sendProps} from "@/utils/RequestUtils";
import FacebookUtils from "@/utils/FacebookUtils";
import { whatsappLogin } from "@/services/ServerActions/Authentication";


async function handleWhatsappLogin(code: string, state: string, originalState: string): Promise<boolean> {
    //verify if state has not been corrupted
    if (state == undefined || state != originalState) {
        //TEMP: handle this error
        console.log('erro no state')
        console.log(state, originalState)
        return false
    }

    if (code == undefined) {
        //TEMP: treat this error
        console.log('Erro no code')
        return false
    }

    return await whatsappLogin(code);
}


function openWhatsappLoginDialog(resultSetter: React.Dispatch<React.SetStateAction<whatsappLoginMessageProps>>) {
    //TEMP: handle errors
    const url = FacebookUtils.getWhatsappLoginUrl();
  
    const originalState = RequestsUtils.getUrlParameters(url).state;
    
    const loginWindow = FacebookUtils.popupWindow(url, 'FBLoginWindow', window, 500, 500);

    if (!loginWindow) {
        //TEMP: handle this error
        console.error('Erro ao abrir janela de login.')
        return
    }

    window.addEventListener('message', async (event) => {
        if (event.origin !== window.location.origin || event.data.type !== 'whatsappOauth') {
            return; // Ignore messages from other origins
        }
    
        // Process the message
        const loginParameters = event.data;
        let result: boolean = false
        if (loginParameters && loginParameters.code && loginParameters.state) {
            result = await handleWhatsappLogin(loginParameters.code, loginParameters.state, originalState);
        }

        if (result) {
            resultSetter({error: false, message: 'Login realizado com sucesso'})
        } else {
            resultSetter({error: true, message: 'Erro ao realizar login no whatsapp'})
        }
    })
}


interface whatsappLoginMessageProps {
    error: boolean,
    message: string
}
export default function FacebookLogin() {
    const [whatsappLoginMessage, setWhatsappLoginMessage] = useState<whatsappLoginMessageProps>({error: false, message: ''});
    
    return (
        <>
        <FacebookLoginButton onClick={() => openWhatsappLoginDialog(setWhatsappLoginMessage)}>
            Conecte ao Whatsapp
        </FacebookLoginButton>
        {whatsappLoginMessage.message != '' && <p style={!whatsappLoginMessage.error ? {color:'green'} : {color:'red'}}>{whatsappLoginMessage.message}</p>}
        </>
        
    )
}