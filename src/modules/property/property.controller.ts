import {Request, Response} from "express";

export class PropertyController{
    getAllProperty(req: Request, res: Response) {
        return res.send('property found');
    }

    getProperty(req: Request, res: Response) {
        return res.send('property found');
    }

    updateProperty(req: Request, res: Response) {
        return res.send('property updated');
    }

    createProperty(req: Request, res: Response) {
        console.log(req.body)
        return res.send('property created');
    }

    deleteProperty(req: Request, res: Response) {
        console.log(req.params)
        return res.send('property deleted');
    }
}