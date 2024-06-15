//external dependencies
import { Request, Response } from "express";

//internal dependencies
import { IFacebookController, IFacebookService } from "../models/Facebook";
import { SearchWhatsappTemplateSchema } from "../schemas/FacebookSchema";

class FacebookController implements IFacebookController {

    constructor(private facebookService: IFacebookService) {}

    async searchWhatsappTemplate(req: Request, res: Response): Promise<Response> {
        const userId = req.body.userId;
        const templateName = req.query.templateName;

        try {
            await SearchWhatsappTemplateSchema.validate({userId, templateName})
        } catch (error) {
            return res.status(400).json({error});
        }

        try {
            const result = await this.facebookService.searchWhatsappTemplate(userId, templateName as string);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({error});
        }
    }
}

export default FacebookController;