'use client'
//external dependencies
import { useEffect } from "react";


export default function Page() {
    useEffect(() => {
        //Extract the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state')

        console.log(window.location.origin);
        console.log(window.location.search)
        //Send the auth code to the parent window
        if (window.opener) {
            console.log('Definido')
            window.opener.postMessage({ type: 'whatsappOauth', code, state }, window.location.origin);
        } else {
            console.log('Nao definido')
        }
        
        //Close the popup window
        window.close();
    },[])
}