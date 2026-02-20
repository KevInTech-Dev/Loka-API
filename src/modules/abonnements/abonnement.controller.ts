import {Request, Response} from "express";

export class AbonnementController {

    getAllAbonnements(req: Request, res: Response) {
        return res.send('subscription found');
    }

    getAbonnement(req: Request, res: Response) {
        return res.send('subscription found');
    }

    updateAbonnement(req: Request, res: Response) {
        return res.send('subscription updated');
    }

    createAbonnement(req: Request, res: Response) {
        console.log(req.body)
        return res.send('subscription created');
    }

    deleteAbonnement(req: Request, res: Response) {
        console.log(req.params)
        return res.send('subscription deleted');
    }

}