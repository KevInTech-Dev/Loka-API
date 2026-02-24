import {Router} from "express";
import {AbonnementController} from "@/modules/abonnements/abonnement.controller";
import validate from "../middleware/validate.middleware";
import { createAbonnementSchema, updateAbonnementSchema, abonnementIdSchema } from "./abonnement.schema";


const router: Router = Router();
const abonnementController = new AbonnementController();

// get all subscriptions
router.get('', abonnementController.getAllAbonnements);


// get subscription by id
router.get('/:id', validate({ params: abonnementIdSchema }), abonnementController.getAbonnement);

//get subscription by label
router.get('/label/:label', abonnementController.getAbonnementByLabel);

// update subscription 
router.patch('/', validate({
    params: abonnementIdSchema,
    body: updateAbonnementSchema,

}), abonnementController.updateAbonnement);

// update subscription by id
router.patch('/:id', validate({
    params: abonnementIdSchema,
    body: updateAbonnementSchema,

}), abonnementController.updateAbonnement);

// create subscription
router.post('', abonnementController.createAbonnement);

// delete subscription by id
router.delete('/:id', abonnementController.deleteAbonnement);

export default router;