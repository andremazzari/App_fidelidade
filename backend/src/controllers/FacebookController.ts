//external dependencies
import { Request, Response } from "express";

//internal dependencies
import { IFacebookController, IFacebookService } from "../models/Facebook";
import { SearchWhatsappTemplateSchema, GetRegisteredWhatsappTemplates, UpsertWhatsappTemplateSchema, CreateWhatsappTemplateSchema } from "../schemas/FacebookSchema";
import FacebookSchemas from "../schemas/FacebookSchema";
import Utils from "../utils/Utils";

class FacebookController implements IFacebookController {

    constructor(private facebookService: IFacebookService) {}

    async searchWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const templateId = req.query.templateId;
        const templateName = req.query.templateName;
        const fields = req.query.fields;

        try {
            await FacebookSchemas.searchWhatsappTemplate().validate({userId, templateId, templateName, fields})
            //await SearchWhatsappTemplateSchema.validate({userId, templateId, templateName, fields})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.facebookService.searchWhatsappTemplate(userId, templateId as string | undefined, templateName as string | undefined, fields as string);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async createWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const templateName = req.body.templateName;
        const templateCategory = req.body.templateCategory;
        const components = Utils.parseJSONString(req.body.components);

        try {
            await FacebookSchemas.createWhatsappTemplate().validate({userId, templateName, templateCategory, components})
            //await CreateWhatsappTemplateSchema.validate({userId, templateName, templateCategory, components})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            await this.facebookService.createWhatsappTemplate(userId, templateName, templateCategory, components);
            return res.status(200).json({});
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async getRegisteredWhatsappTemplates(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;

        try {
            await FacebookSchemas.getRegisteredWhatsappTemplates().validate({userId});
            //await GetRegisteredWhatsappTemplates.validate({userId})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.facebookService.getRegisteredWhatsappTemplates(userId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async upsertWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const templateId = req.body.templateId;
        const templateName = req.body.templateName;
        const languageCode = req.body.templateLanguage;
        const templateStatus = req.body.templateStatus;
        const templateCategory = req.body.templateCategory;
        const componentsConfig = req.body.componentsConfig;
        
        try {
            await FacebookSchemas.upsertWhatsappTemplate().validate({userId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig: JSON.parse(componentsConfig)});
            //await UpsertWhatsappTemplateSchema.validate({userId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig: JSON.parse(componentsConfig)})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            //TEMP: handle errors
            await this.facebookService.upsertWhatsappTemplate(userId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig);
            //TEMP: should I return something ?
            return res.status(200).json({});
        } catch (error) {
            return res.status(500).json({error});
        }
    }
}

export default FacebookController;