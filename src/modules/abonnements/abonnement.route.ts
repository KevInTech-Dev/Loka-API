import {Router} from "express";
import {AbonnementController} from "@/modules/abonnements/abonnement.controller";


const router: Router = Router();
const abonnementController = new AbonnementController();

// get all subscriptions
router.get('', abonnementController.getAllAbonnements);


// get subscription by id
router.get('/:id', abonnementController.getAbonnement);

// update subscription by id
router.patch('', abonnementController.updateAbonnement);

// create subscription
router.post('', abonnementController.createAbonnement);

// delete subscription by id
router.delete('/:id', abonnementController.deleteAbonnement);

export default router;