import { Router } from "express";
import { LandLordController } from "./landLord.controller";


const router: Router = Router();
const landlordController = new LandLordController();

router.get('', landlordController.getAllLandlords);

router.get('/:id', landlordController.getlandLord);

router.patch('', landlordController.updatelandLord);

router.post('', landlordController.createlandLord);

router.delete('', landlordController.deletelandLord);

export default router;