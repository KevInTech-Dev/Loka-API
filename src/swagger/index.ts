import env from "@config/env";
import { OpenAPIV3 } from "openapi-types";
import { userPath, userSchema, userTags } from "@/swagger/user.swagger";
import { propertyPath, propertyShema, propertyTags } from "./property.swagger";
import { propertyTypePath, propertyTypeShema, propertyTypeTags } from "./propertType.swagger";
import { abonnementsSchema, abonnementsTags, abonnementPath } from "./abonnement.swagger";
import { landlordPath, landlordSchema, landlordTags } from "./landLord.swagger";
import { propertyUnitLocationPath, propertyUnitLocationSchema } from "./propertyUnitLocation.swagger";
import { unitLocationPath, unitLocationSchema, unitLocationTags } from "./unitLocation.swagger";
import { unitTypePath, unitTypeSchema } from "./unitType.swagger";

import { tenantPath, tenantSchema, tenantTags } from "./tenant.swagger";
import { authenticationSchema, AuthentificationPath, refreshTokenObjectPath, refreshTokenObjectSchema, RefreshTokenPath, refreshTokenSchema, RegistrationPath, registrationSchema } from "./login.swagger";
import { contractPath, contractSchema, contractTags } from "@/swagger/contract.swagger";

import { utilisateurAbonnementPath, utilisateurAbonnementSchema, utilisateurAbonnementTags } from "./utilisateur_abonnement.swagger";
import { meterReadingSchema, meterReadingTags } from "@/swagger/meterReading.swagger";
import { meterReadingPath } from "@/swagger/meterReading.swagger";
import { factureAbonnementPath, factureAbonnementSchema, factureAbonnementTags } from "./FactureAbonnement.swagger";
import { factureLoyerPath, factureLoyerSchema, factureLoyerTags } from "./FactureLoyer.swagger";
import { factureElectricitePath, factureElectriciteSchema, factureElectriciteTags } from "./FactureElectricite.swagger";
import { factureMaintenancePath, factureMaintenanceSchema, factureMaintenanceTags } from "./FactureMaintenance.swagger";
import { factureEauPath, factureEauSchema, factureEauTags } from "./FactureEau.swagger";
import { maintenancePath, maintenanceSchema, maintenanceTags } from "./maintenance.swagger";
import { technicalManagerPath, technicalManagerSchema, technicalManagerTags } from "./technicalManager.swagger";


export const tags: OpenAPIV3.TagObject[] = [
    userTags,
    landlordTags,
    tenantTags,
    abonnementsTags,
    utilisateurAbonnementTags,
    contractTags,
    abonnementsTags,
    utilisateurAbonnementTags,
    meterReadingTags,
    maintenanceTags,
    factureAbonnementTags,
    factureMaintenanceTags,
    factureLoyerTags,
    factureEauTags,
    factureElectriciteTags,
    propertyTags,
    unitLocationTags,
    propertyTypeTags,
    abonnementsTags,
    utilisateurAbonnementTags,
    technicalManagerTags
];

export const paths: OpenAPIV3.PathsObject = {
    // Health endpoint
    '/health': {
        get: {
            tags: ['Health'],
            summary: 'Health check',
            description: 'Check if the API is running and healthy',
            security: [],
            responses: {
                '200': {
                    description: 'API is healthy',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: { type: 'boolean', example: true },
                                    message: { type: 'string', example: 'API is healthy' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    // Module paths
    ...userPath,
    ...propertyPath,
    ...propertyTypePath,
    ...landlordPath,
    ...propertyUnitLocationPath,
    ...unitLocationPath,
    ...unitTypePath,
    ...propertyShema,
    ...propertyTypeShema,
    ...landlordPath,
    ...tenantPath,
    ...AuthentificationPath,
    ...RegistrationPath,
    ...abonnementPath,
    ...utilisateurAbonnementPath,
    ...tenantPath,
    ...abonnementsSchema,
    ...RegistrationPath,
    ...contractPath,
    ...RefreshTokenPath,
    ...refreshTokenObjectPath,
    ...abonnementPath,
    ...utilisateurAbonnementPath,
    ...tenantPath,
    ...meterReadingPath,
    ...factureAbonnementPath,
    ...factureLoyerPath,
    ...factureElectricitePath,
    ...factureMaintenancePath,
    ...factureEauPath,
    ...maintenancePath,
    ...technicalManagerPath

};

export const schemas: OpenAPIV3.ComponentsObject['schemas'] = {
    ...userSchema,
    ...propertyShema,
    ...propertyTypeShema,
    ...landlordSchema,
    ...utilisateurAbonnementSchema,
    ...tenantSchema,
    ...propertyUnitLocationSchema,
    ...unitLocationSchema,
    ...unitTypeSchema,
    ...tenantSchema,
    ...registrationSchema,
    ...authenticationSchema,
    ...contractSchema,
    ...refreshTokenSchema,
    ...refreshTokenObjectSchema,
    ...abonnementsSchema,
    ...meterReadingSchema,
    ...abonnementsSchema,
    ...factureAbonnementSchema,
    ...factureLoyerSchema,
    ...factureElectriciteSchema,
    ...factureMaintenanceSchema,
    ...factureEauSchema,
    ...maintenanceSchema,
    ...technicalManagerSchema

};


export const swaggerSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'Rental Management API',
        version: '1.0.0'
        ,
        contact: {
            name: 'TAD IT Consulting',
            email: 'support@tad-it.consulting',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
            description: 'Development server',
        },

    ],
    tags,
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas,
        // responses,
    },
    security: [
    ],
    paths,
};

export default swaggerSpec;
