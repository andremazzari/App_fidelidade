class FacebookUtils {
    static baseUrl() {
        return `https://graph.facebook.com/${process.env.FACEBOOK_API_VERSION}`
    }

    static apiHeader(token: string) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    static extractWABMID(wamid: string) {
        return wamid.replace("wamid.", "");
    }
}

export default FacebookUtils;