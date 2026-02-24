import { z } from 'zod';


// SCHÉMA POUR LA CRÉATION

const createUtilisateurAbonnementSchema = z.object({
    utilisateurId: z.uuid('Format d\'ID utilisateur invalide'),
    abonnementId: z.uuid('Format d\'ID abonnement invalide'),
    //dateDebut: z.iso.datetime().optional().default(() => new Date().toISOString()),
    //dateFin: z.iso.datetime().optional().nullable(),
    //autoRenouvellement: z.boolean().optional().default(false)
});


/* SCHÉMA POUR LA MISE À JOUR

const updateUtilisateurAbonnementSchema = z.object({
    dateFin: z.iso.datetime().optional().nullable(),
    autoRenouvellement: z.boolean().optional()
}).refine(data => {
    // Note: Cette validation nécessite l'accès à la dateDebut existante en base
    // Elle sera implémentée dans le service
    return true;
}, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["dateFin"]
});
*/

// SCHÉMA POUR L'ID (PARAMS)

const utilisateurAbonnementIdSchema = z.object({
    id: z.uuid('Format d\'ID de relation invalide')
});


// SCHÉMAS POUR LES FILTRES

const getByUtilisateurIdSchema = z.object({
    utilisateurId: z.uuid('Format d\'ID utilisateur invalide')
});

const getByAbonnementIdSchema = z.object({
    abonnementId: z.uuid('Format d\'ID abonnement invalide')
});

const getActifsQuerySchema = z.object({
    includeExpires: z.enum(['true', 'false']).optional().default('false')
}).optional();


/*SCHÉMA POUR LA RÉPONSE

const utilisateurAbonnementResponseSchema = z.object({
    id: z.uuid(),
    utilisateurId: z.uuid(),
    abonnementId: z.uuid(),
    dateDebut: z.iso.datetime(),
    dateFin: z.iso.datetime().nullable(),
    autoRenouvellement: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime()
});
*/

// TYPES INFÉRÉS

export type CreateUtilisateurAbonnementInput = z.infer<typeof createUtilisateurAbonnementSchema>;
//export type UpdateUtilisateurAbonnementInput = z.infer<typeof updateUtilisateurAbonnementSchema>;
export type UtilisateurAbonnementIdParams = z.infer<typeof utilisateurAbonnementIdSchema>;
export type GetByUtilisateurIdParams = z.infer<typeof getByUtilisateurIdSchema>;
export type GetByAbonnementIdParams = z.infer<typeof getByAbonnementIdSchema>;
export type GetActifsQuery = z.infer<typeof getActifsQuerySchema>;
//export type UtilisateurAbonnementResponse = z.infer<typeof utilisateurAbonnementResponseSchema>;

// EXPORTS

export {
    createUtilisateurAbonnementSchema,
   // updateUtilisateurAbonnementSchema,
    utilisateurAbonnementIdSchema,
    getByUtilisateurIdSchema,
    getByAbonnementIdSchema,
    getActifsQuerySchema,
   // utilisateurAbonnementResponseSchema
};