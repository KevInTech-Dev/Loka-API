import {Router} from "express";
import {AbonnementController} from "@/modules/abonnements/abonnement.controller";
import validate from "../middleware/validate.middleware";
import { createAbonnementSchema, updateAbonnementSchema, abonnementIdSchema, getAbonnementSchema } from "./abonnement.schema";


const router: Router = Router();
const abonnementController = new AbonnementController();

// get all subscriptions paginated

router.get('/',    validate({query: getAbonnementSchema}), abonnementController.getAbonnementPaginated);//validate({body: abonnementsSchema}),

// get subscription by id
router.get('/:id', validate({ params: abonnementIdSchema }), abonnementController.getAbonnementByid);


// update subscription by id
router.patch('/:id', validate({
    params: abonnementIdSchema,
    body: updateAbonnementSchema,
}), abonnementController.createAbonnement);

// create subscription
router.post('',  validate({ body: createAbonnementSchema }), abonnementController.createAbonnement);

// delete subscription by id
router.delete('/:id', validate({ params: abonnementIdSchema }) ,abonnementController.deleteAbonnement);

export default router;



//get subscription by label
//router.get('/label/:label', abonnementController.getAbonnementByLabel);
