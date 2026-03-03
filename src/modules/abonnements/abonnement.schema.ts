// abonnement.schema.ts - VERSION CORRIGÉE
import { z } from 'zod';
import { PlanAbonnementEnum } from '@/enums/PlanAbonnementEnum';

// Créer un tableau des valeurs de l'enum
const planAbonnementValues = Object.values(PlanAbonnementEnum) as [string, ...string[]];

// Schéma pour la création
const createAbonnementSchema = z.object({
    planAbonnement: z.enum(planAbonnementValues), 
    nombreMaxPropriete: z.number(),
    nombreMaxUnitLocation: z.number(),
    label: z.string().optional(),
    prix: z.number().positive(),
    detail: z.string().min(5),
    other: z.record(z.string(), z.any()).optional(),
});

const getAbonnementSchema = z.object({
    limit: z.string('Format de la limite  invalide'),
    page: z.string('Format de la valeur de la page invalide'),
})

//Schéma pour la mise à jour 
const updateAbonnementSchema = z.object({
    planAbonnement: z.enum(planAbonnementValues).optional(), 
    nombreMaxPropriete: z.number(),
    nombreMaxUnitLocation: z.number(),
    label: z.string().optional(),
    prix: z.number().positive().optional(),
    detail: z.string().min(5).optional(),
    other: z.record(z.string(), z.any()).optional(),
});

// Schéma pour l'ID (pour les params)
export const abonnementIdSchema = z.object({
    id: z.uuid('Format d\'ID d\'abonnement invalide'),
});

// Types inférés 
export type CreateAbonnementInput = z.infer<typeof createAbonnementSchema>;
export type GetAbonnementInput = z.infer<typeof getAbonnementSchema>;
export type UpdateAbonnementInput = z.infer<typeof updateAbonnementSchema>;
export type AbonnementIdParams = z.infer<typeof abonnementIdSchema>;

export {
   createAbonnementSchema,
   updateAbonnementSchema,
   getAbonnementSchema,
};