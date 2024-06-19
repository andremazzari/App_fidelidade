//internal dependencies
import { mysqlClient } from "../connectors/MySQL";
import FacebookFactory from "../factory/FacebookFactory";
import { IFacebookRepository } from "../models/Facebook";

class WhatsappTemplate {
    private facebookRepository: IFacebookRepository;
    public templateName: string | null
    public componentConfig: Array<Record<string, any>> | null
    public languageCode: string | null

    constructor(private userId: string, private templateId: string, private points: number, private target: number) {
        this.facebookRepository = FacebookFactory.repository();
        this.componentConfig = null;
        this.templateName = null;
        this.languageCode = null;
    }

    async prepareTemplateInfo() {
        //This function should be run before the class is used
        const templateInfo = await this.facebookRepository.getWhatsappTemplateInfo(this.userId, this.templateId);

        //set template name
        this.templateName = templateInfo.template_name;

        //set component config
        if (templateInfo.components_config && templateInfo.components_config.lenght > 0) {
            this.componentConfig = templateInfo.components_config.map((item: Record<string, any>) => this.prepareComponentConfig(item))
        }

        //set language code
        this.languageCode = templateInfo.language_code;
    }

    private prepareComponentConfig(item: Record<string, any>) {
        //TEMP: handle other parameters other than 'body'
        if (item.parameters) {
            const parameters = item.parameters.map((parameter: any) => {
                if (parameter.type == 'text') {
                    switch (parameter.text) {
                        case '*{{points}}*':
                            parameter.text = this.points.toString();
                            break;
                        case '*{{target}}*':
                            parameter.text = this.target.toString();
                            break;
                    }
                }
                //TEMP: include other types of parameters. But before this is not supported, should I throw an error ?
                return parameter
            })

            item.parameters = parameters
        }

        return item
    }
}

export default WhatsappTemplate