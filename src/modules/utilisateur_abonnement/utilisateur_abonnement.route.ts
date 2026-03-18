import { Router } from "express";
import { Utilisateur_AbonnementController } from "./utilisateur_abonnement.controller";
import validate from "../middleware/validate.middleware";

import { createUtilisateurAbonnementSchema, getAbonnementByUtilisateur, utilisateurAbonnementIdSchema } from "./utilisateur_abonnement.schema";
import { getUtilisateurAbonnementSchema } from "./utilisateur_abonnement.schema";

const router: Router = Router();
const controller = new Utilisateur_AbonnementController();

// Définition des points d'entrée (Endpoints)
router.post("", validate(createUtilisateurAbonnementSchema, 'body'), controller.create);
router.get("", validate(getUtilisateurAbonnementSchema, 'query'), controller.getAbonnementPaginated); // 
router.get("/:id", validate(utilisateurAbonnementIdSchema, 'params'), controller.getById);
router.get("/utilisateur/:id", validate
    ({
        params: utilisateurAbonnementIdSchema,
        query: getAbonnementByUtilisateur
    }), controller.getAbonnementByUtilisateurPaginated);

//router.put("/:id", controller.update);
//router.delete("/:id", controller.);

export default router;