import { Router } from "express";
import { Utilisateur_AbonnementController } from "./utilisateur_abonnement.controller";
import validate from "../middleware/validate.middleware";
import { createAbonnementSchema } from "../abonnements/abonnement.schema";
import { getAbonnementByUtilisateur, utilisateurAbonnementIdSchema } from "./utilisateur_abonnement.schema";
import { getUtilisateurAbonnementSchema } from "./utilisateur_abonnement.schema";

const router = Router();
const controller = new Utilisateur_AbonnementController();

// Définition des points d'entrée (Endpoints)
router.post("/",   validate({body: createAbonnementSchema}), controller.create);
router.get("/" ,   validate({query:getUtilisateurAbonnementSchema}),controller.getAbonnementPaginated); // 
router.get("/:id", validate({params: utilisateurAbonnementIdSchema}), controller.getById);
router.get("/utilisateur/:id", validate({query: getAbonnementByUtilisateur}), controller.getAbonnementByUtilisateurPaginated);

//router.put("/:id", controller.update);
//router.delete("/:id", controller.delete);

export default router;