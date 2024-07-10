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
        const companyId = req.body.companyId;
        const templateId = req.query.templateId;
        const templateName = req.query.templateName;
        const fields = req.query.fields;
        
        try {
            await FacebookSchemas.searchWhatsappTemplate().validate({companyId, templateId, templateName, fields})
            //await SearchWhatsappTemplateSchema.validate({userId, templateId, templateName, fields})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.facebookService.searchWhatsappTemplate(companyId, templateId as string | undefined, templateName as string | undefined, fields as string);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async createWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const companyId = req.body.companyId;
        const templateName = req.body.templateName;
        const templateCategory = req.body.templateCategory;
        const components = Utils.parseJSONString(req.body.components);

        try {
            await FacebookSchemas.createWhatsappTemplate().validate({companyId, templateName, templateCategory, components})
            //await CreateWhatsappTemplateSchema.validate({userId, templateName, templateCategory, components})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            await this.facebookService.createWhatsappTemplate(companyId, templateName, templateCategory, components);
            return res.status(200).json({});
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async getRegisteredWhatsappTemplates(req: Request, res: Response): Promise<Response> {
        const companyId = req.body.companyId;

        try {
            await FacebookSchemas.getRegisteredWhatsappTemplates().validate({companyId});
            //await GetRegisteredWhatsappTemplates.validate({userId})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.facebookService.getRegisteredWhatsappTemplates(companyId);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }

    async upsertWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const companyId = req.body.companyId;
        const templateId = req.body.templateId;
        const templateName = req.body.templateName;
        const languageCode = req.body.templateLanguage;
        const templateStatus = req.body.templateStatus;
        const templateCategory = req.body.templateCategory;
        const componentsConfig = req.body.componentsConfig;
        
        try {
            await FacebookSchemas.upsertWhatsappTemplate().validate({companyId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig: JSON.parse(componentsConfig)});
            //await UpsertWhatsappTemplateSchema.validate({userId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig: JSON.parse(componentsConfig)})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            //TEMP: handle errors
            await this.facebookService.upsertWhatsappTemplate(companyId, templateId, templateName, languageCode, templateStatus, templateCategory, componentsConfig);
            //TEMP: should I return something ?
            return res.status(200).json({});
        } catch (error) {
            return res.status(500).json({error});
        }
    }
}

export default FacebookController;