import { StatusAbonnementEnum } from '@/enums/StatusAbonnement';
import { z } from 'zod';


// SCHÉMA POUR LA CRÉATION

const createUtilisateurAbonnementSchema = z.object({
    utilisateurId: z.uuid(),
    abonnementId: z.uuid(),
    // status: StatusAbonnementEnum.INACTIVE,
    autoRenouvellement: z.boolean().optional().default(false),
    startDate: z.iso.datetime().optional().default(() => new Date().toISOString()),
    endDate: z.iso.datetime().optional().nullable(),
    //dateDebut: z.iso.datetime().optional().default(() => new Date().toISOString()),
    //dateFin: z.iso.datetime().optional().nullable(),
    //autoRenouvellement: z.boolean().optional().default(false)
});


const getAbonnementByUtilisateur = z.object({
    page: z.string('Format de la page   invalide'),
    limit: z.string('Format de la limite invalide'),
});


const getUtilisateurAbonnementSchema = z.object({
    page: z.string('Format de la valeur de la page invalide'),
    limit: z.string('Format de la limite invalide'),
});

const utilisateurAbonnementIdSchema = z.object({
    id: z.uuid('Format d\'ID de relation invalide')//(user et sub existent d'abord donc oublie validation de id .)
})


// SCHÉMAS POUR LES FILTRES

const getByUtilisateurIdSchema = z.object({
    utilisateurId: z.uuid('Format d\'ID utilisateur invalide')
})

const getByAbonnementIdSchema = z.object({
    abonnementId: z.uuid('Format d\'ID abonnement invalide')
})

const getActifsQuerySchema = z.object({
    includeExpires: z.enum(['true', 'false']).optional().default('false')
});



// TYPES INFÉRÉS

export type CreateUtilisateurAbonnementInput = z.infer<typeof createUtilisateurAbonnementSchema> & {
    status?: StatusAbonnementEnum
};
export type UtilisateurAbonnementIdParams = z.infer<typeof utilisateurAbonnementIdSchema>;
export type GetByUtilisateurIdParams = z.infer<typeof getByUtilisateurIdSchema>;
export type GetByAbonnementIdParams = z.infer<typeof getByAbonnementIdSchema>;
export type GetActifsQuery = z.infer<typeof getActifsQuerySchema>;
//export type UtilisateurAbonnementResponse = z.infer<typeof utilisateurAbonnementResponseSchema>;
//export type UpdateUtilisateurAbonnementInput = z.infer<typeof updateUtilisateurAbonnementSchema>;


// EXPORTS

export {
    createUtilisateurAbonnementSchema,
    utilisateurAbonnementIdSchema,
    getUtilisateurAbonnementSchema,
    getAbonnementByUtilisateur,
    //getActifsQuerySchema,
    //utilisateurAbonnementResponseSchema
    //updateUtilisateurAbonnementSchema,
    //getByUtilisateurIdSchema,
    //getByAbonnementIdSchema,
};
























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
