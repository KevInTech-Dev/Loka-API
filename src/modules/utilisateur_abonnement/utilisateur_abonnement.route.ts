import { Router } from "express";
import { Utilisateur_AbonnementController } from "./utilisateur_abonnement.controller";
import { utilisateurAbonnementIdSchema } from "./utilisateur_abonnement.schema";
import validate from "../middleware/validate.middleware";

import { createAbonnementSchema } from "../abonnements/abonnement.schema";

const router = Router();
const controller = new Utilisateur_AbonnementController();

// Définition des points d'entrée (Endpoints)
router.post("/",  validate({
    params: utilisateurAbonnementIdSchema,
    body: createAbonnementSchema,
}), controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
//router.put("/:id", controller.update);
//router.delete("/:id", controller.delete);

export default router;