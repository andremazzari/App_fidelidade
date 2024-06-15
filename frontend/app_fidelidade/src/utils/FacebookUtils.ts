class FacebookUtils {
    static popupWindow(url: string, windowName: string, window: Window, width: number, height: number) {
        const leftPosition = (window.screen.width - width) / 2;
        const topPosition = (window.screen.height - height) / 2;
    
        const windowProperties = `width=${width},height=${height},left=${leftPosition},top=${topPosition},toolbar=no,location=no,menubar=no,status=no,resizable=yes,scrollbars=yes`
    
        return window.open(url, windowName, windowProperties)
    }
    
    static getWhatsappLoginUrl() {
        //TEMP: future update: use env variables. Use uuid for the state
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_LOGIN_REDIRECT_URI;
        //TEMP: use random state
        const state = '1';
        const config_id = process.env.NEXT_PUBLIC_WHATSAPP_LOGIN_CONFIG_ID;
    
        return `https://www.facebook.com/${process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION}/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&state=${state}&config_id=${config_id}`;
    }
}

export default FacebookUtils
