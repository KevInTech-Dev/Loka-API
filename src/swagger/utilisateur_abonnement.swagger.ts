import { OpenAPIV3 } from "openapi-types";

// TAG

const utilisateurAbonnementTags: OpenAPIV3.TagObject = {
    name: "Utilisateur Abonnement",
    description: "Opérations de gestion des relations entre utilisateurs et abonnements"
};


// SCHEMAS

const utilisateurAbonnementSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    UtilisateurAbonnement: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "Identifiant unique de la relation",
                example: "123e4567-e89b-12d3-a456-426614174000"
            },
            utilisateurId: {
                type: "string",
                format: "uuid",
                description: "Identifiant de l'utilisateur",
                example: "123e4567-e89b-12d3-a456-426614174001"
            },
            abonnementId: {
                type: "string",
                format: "uuid",
                description: "Identifiant de l'abonnement",
                example: "123e4567-e89b-12d3-a456-426614174002"
            },
            dateDebut: {
                type: "string",
                format: "date-time",
                description: "Date de début de l'abonnement",
                example: "2026-01-15T10:30:00Z"
            },
            endDate: {
                type: "string",
                format: "date-time",
                description: "Date de fin de l'abonnement",
                example: "2027-01-15T10:30:00Z",
                nullable: true
            },
            statut: {
                type: "string",
                enum: ["ACTIF", "INACTIF", "EXPIRE", "SUSPENDU"],
                description: "Statut de l'abonnement utilisateur",
                example: "ACTIF"
            },
            autoRenouvellement: {
                type: "boolean",
                description: "Indique si l'abonnement se renouvelle automatiquement",
                example: true
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Date de création de la relation",
                example: "2026-01-15T10:30:00Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Date de dernière mise à jour",
                example: "2026-01-15T10:30:00Z"
            }
        },
        required: ["utilisateurId", "abonnementId", "dateDebut", "statut"]
    },

    UtilisateurAbonnementCreate: {
        type: "object",
        properties: {
            utilisateurId: {
                type: "string",
                format: "uuid",
                description: "Identifiant de l'utilisateur",
                example: "123e4567-e89b-12d3-a456-426614174001"
            },
            abonnementId: {
                type: "string",
                format: "uuid",
                description: "Identifiant de l'abonnement",
                example: "123e4567-e89b-12d3-a456-426614174002"
            },
            autoRenouvellement: {
                type: "boolean",
                description: "Indique si l'abonnement se renouvelle automatiquement (défaut: false)",
                example: true
            }
        },
        required: ["utilisateurId", "abonnementId", "autoRenouvellement"]
    },

    UtilisateurAbonnementUpdate: {
        type: "object",
        properties: {
            dateFin: {
                type: "string",
                format: "date-time",
                description: "Date de fin de l'abonnement",
                example: "2027-01-15T10:30:00Z",
                nullable: true
            },
            statut: {
                type: "string",
                enum: ["ACTIF", "INACTIF", "EXPIRE", "SUSPENDU"],
                description: "Statut de l'abonnement utilisateur",
                example: "INACTIF"
            },
            autoRenouvellement: {
                type: "boolean",
                description: "Indique si l'abonnement se renouvelle automatiquement",
                example: false
            }
        }
    }
};


// PATHS
const utilisateurAbonnementPath: OpenAPIV3.PathsObject = {
    "/utilisateur-abonnements": {
        get: {
            tags: ["Utilisateur Abonnement"],
            summary: "Récupérer toutes les relations",
            description: "Récupère la liste de toutes les relations utilisateurs-abonnements",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 1
                    },
                    description: "Page umber (starting from 1)"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 10
                    },
                    description: "Number of items per page"
                }
            ],
            responses: {
                "200": {
                    description: "A list of maintenance invoice",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    page: {
                                        type: "integer"
                                    },
                                    limit: {
                                        type: "integer"
                                    },
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/UtilisateurAbonnement"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ["Utilisateur Abonnement"],
            summary: "Créer une nouvelle relation",
            description: "Crée une nouvelle relation entre un utilisateur et un abonnement",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UtilisateurAbonnementCreate"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Relation créée avec succès",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UtilisateurAbonnement"
                            }
                        }
                    }
                },
                "400": {
                    description: "Données invalides"
                }
            }
        }
    },

    "/utilisateur-abonnements/{id}": {
        get: {
            tags: ["Utilisateur Abonnement"],
            summary: "Récupérer une relation par ID",
            description: "Récupère une relation utilisateur-abonnement par son identifiant unique",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "L'identifiant unique de la relation"
                }
            ],
            responses: {
                "200": {
                    description: "Relation trouvée",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UtilisateurAbonnement"
                            }
                        }
                    }
                },
                "404": {
                    description: "Relation non trouvée"
                }
            }
        },
        patch: {
            tags: ["Utilisateur Abonnement"],
            summary: "Mettre à jour une relation",
            description: "Met à jour les informations d'une relation par son ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "L'identifiant unique de la relation"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/UtilisateurAbonnementUpdate"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Relation mise à jour avec succès",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/UtilisateurAbonnement"
                            }
                        }
                    }
                },
                "400": {
                    description: "Données invalides"
                },
                "404": {
                    description: "Relation non trouvée"
                }
            }
        },
        delete: {
            tags: ["Utilisateur Abonnement"],
            summary: "Supprimer une relation",
            description: "Supprime une relation utilisateur-abonnement par son ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "L'identifiant unique de la relation"
                }
            ],
            responses: {
                "200": {
                    description: "Relation supprimée avec succès"
                },
                "404": {
                    description: "Relation non trouvée"
                }
            }
        }
    },

    "/utilisateur-abonnements/utilisateur/{utilisateurId}": {
        get: {
            tags: ["Utilisateur Abonnement"],
            summary: "Récupérer les abonnements d'un utilisateur",
            description: "Récupère tous les abonnements d'un utilisateur spécifique",
            parameters: [
                {
                    name: "utilisateurId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "L'identifiant de l'utilisateur"
                }
            ],
            responses: {
                "200": {
                    description: "Abonnements de l'utilisateur récupérés",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/UtilisateurAbonnement"
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/utilisateur-abonnements/abonnement/{abonnementId}": {
        get: {
            tags: ["Utilisateur Abonnement"],
            summary: "Récupérer les utilisateurs d'un abonnement",
            description: "Récupère tous les utilisateurs ayant un abonnement spécifique",
            parameters: [
                {
                    name: "abonnementId",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "L'identifiant de l'abonnement"
                }
            ],
            responses: {
                "200": {
                    description: "Utilisateurs de l'abonnement récupérés",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/UtilisateurAbonnement"
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/utilisateur-abonnements/actifs": {
        get: {
            tags: ["Utilisateur Abonnement"],
            summary: "Récupérer les relations actives",
            description: "Récupère toutes les relations avec statut ACTIF",
            responses: {
                "200": {
                    description: "Relations actives récupérées",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/UtilisateurAbonnement"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};


// EXPORTS

export {
    utilisateurAbonnementTags,
    utilisateurAbonnementSchema,
    utilisateurAbonnementPath
};