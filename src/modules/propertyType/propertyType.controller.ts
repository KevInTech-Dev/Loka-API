import {Request, Response} from "express";
export class PropertyTypeController{
        getAllpropertyType(req: Request, res: Response) {
            return res.send('property Type found');
        }
    
        getpropertyType(req: Request, res: Response) {
            return res.send('property Type found');
        }
    
        updatepropertyType(req: Request, res: Response) {
            return res.send('property Type updated');
        }
    
        createpropertyType(req: Request, res: Response) {
            console.log(req.body)
            return res.send('property Type created');
        }
    
        deletepropertyType(req: Request, res: Response) {
            console.log(req.params)
            return res.send('property Type deleted');
        }
}