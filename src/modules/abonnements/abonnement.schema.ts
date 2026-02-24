// abonnement.schema.ts - VERSION CORRIGÉE
import { z } from 'zod';
import { PlanAbonnementEnum } from '@/enums/PlanAbonnementEnum';

// Créer un tableau des valeurs de l'enum
const planAbonnementValues = Object.values(PlanAbonnementEnum) as [string, ...string[]];

// Schéma pour la création
const createAbonnementSchema = z.object({
    planAbonnement: z.enum(planAbonnementValues), 
    duree: z.number().positive(),
    label: z.string().optional(),
    prix: z.number().positive(),
    detail: z.string().min(5),
    other: z.record(z.string(), z.any()).optional(),
});

// Schéma pour la mise à jour 
const updateAbonnementSchema = z.object({
    planAbonnement: z.enum(planAbonnementValues).optional(), 
    label: z.string().optional(),
    prix: z.number().positive().optional(),
    detail: z.string().min(5).optional(),
    other: z.record(z.string(), z.any()).optional(),
});

// Schéma pour l'ID (pour les params)
export const abonnementIdSchema = z.object({
    id: z.string().uuid('Format d\'ID d\'abonnement invalide'),
});
// Types inférés 
export type CreateAbonnementInput = z.infer<typeof createAbonnementSchema>;
export type UpdateAbonnementInput = z.infer<typeof updateAbonnementSchema>;
export type AbonnementIdParams = z.infer<typeof abonnementIdSchema>;

export {
    createAbonnementSchema,
    updateAbonnementSchema,
};