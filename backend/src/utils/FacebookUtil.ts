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

    static transformComponentVariablesToFacebookFormat(components: Array<any>) {
        //function to transform the text of templates created from our platform from variables {{points}} and {{target}} to {{n}}.
        //Create a deep copy of components
        let transformedComponents = JSON.parse(JSON.stringify(components));
        for (const component of transformedComponents) {
            //TEMP: support other types of components.
            switch (component.type) {
                case 'HEADER':
                    //TEMP: should I allow variables in the HEADER in the future ?
                    break;
                case 'BODY':
                    if (component.text) {
                        let variableCounter = 1;
                        let variablePositions: Array<string> = []
                        component.text = component.text.replace(/{{points}}|{{target}}/g, (match: string) => {
                            variablePositions.push(match);
                            return `{{${variableCounter++}}}`;
                        });
                        
                        if (variableCounter > 1) {
                            component.example = {
                                body_text: [
                                    variablePositions.map((variable: string) => {
                                        if (variable == '{{points}}') {
                                            return '6'
                                        } else {
                                            return '10'
                                        }
                                    })
                                ] 
                            }
                        }
                        
                    }
                    break;
            }
        }

        return transformedComponents
    }

    static prepareComponentsConfig(components: Array<any>) {
        //Prepara components config to register template created from our platform
        const componentsConfig: Array<any> = []
        for (const component of components) {
            //TEMP: support more types of components
            if (component.text) {
                const matches = [...component.text.matchAll(/{{points}}|{{target}}/g)];
                const parameters: Array<any> = [];

                matches.forEach((match) => {
                    parameters.push({type: 'text', text: match[0]})
                })

                componentsConfig.push({
                    type: component.type,
                    parameters
                })
            }
        }

        return componentsConfig
    }
}

export default FacebookUtils;