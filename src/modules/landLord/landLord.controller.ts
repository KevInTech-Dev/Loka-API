import { Request, Response } from "express"

export class LandLordController {
    getAllLandlords(req: Request, res: Response){
        return res.send('landlord found')
    }

    getlandLord(req: Request, res: Response){
        return res.send('landlord found')
    }

    updatelandLord(req: Request, res: Response){
        return res.send('landlord updated')
    }
    
    createlandLord(req: Request, res: Response) {
        return res.send('landlord created')
    }

    deletelandLord(req: Request, res: Response) {
        console.log(req.params)
        return res.send('user deleted');
    }
}