import { OpenAPIV3 } from "openapi-types";

const abonnementsTags: OpenAPIV3.TagObject = {
    name: "Abonnement",
    description: "Operations related to subscription management"
}

const abonnementsSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    Abonnement: {
        type: "object",
        properties: {
            planAbonnement: {
                type: "string",
                enum: ["BASIC", "PREMIUM", "ENTERPRISE"],
                description: "Type de plan d'abonnement",
                example: "PREMIUM"
            },
            nombreMaxPropriete: {
                type: "number",
                description: "Max number of property to add"
            },
            nombreMaxUnitLocation: {
                type: "number",
                description: "Max number of unit locations to add"
            },
            label: {
                type: "string",
                description: "label of the subscription"
            },
            prix: {
                type: "number",
                format: "float",
                description: "Prix de l'abonnement",
                example: 29.99
            },
            detail: {
                type: "string",
                description: "Description détaillée de l'abonnement",
                example: "Accès à toutes les fonctionnalités premium, support prioritaire"
            },
            other: {
                type: "string",
                description: "field for other things to add"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was last created"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was last updated"
            }
        },
        required: ["planAbonnement", "nombreMaxProperties", "nombreMaxUnitLocation", "label", "prix", "detail"]
    },
    createAbonnementRequest: {
        type: "object",
        properties: {
            planAbonnement: {
                type: "string",
                enum: ['BASIC', 'ENTREPRISE']
            },
            nombreMaxPropriete: {
                type: "number",
                description: "Max number of property to add"
            },
            nombreMaxUnitLocation: {
                type: "number",
                description: "Max number of unit location to add"
            },
            label: {
                type: "string",
                description: "label of the subscription"
            },
            prix: {
                type: "number",
                description: "price of the subscription"
            },
            detail: {
                type: "string",
                description: "details of the subscription"
            }
        },
        required: ["planAbonnement", "nombreMaxProprietes", "nombreMaxUnitLocation", "label", "prix", "detail"]
    },
    paginatedAbonnement: {
        type: "object",
        properties: {
            page: {
                type: "integer",
                description: "Current page number"
            },
            limit: {
                type: "integer",
                description: "Number of items per page"
            },
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/Abonnement"
                }
            }
        }
    }
};
const abonnementPath: OpenAPIV3.PathsObject = {
    "/abonnements": {
        get: {
            tags: ["Abonnement"],
            summary: "Get all subscriptions",
            description: "Retrieve a list of all subscriptions in the system",
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
                    description: "A list of subscriptions",
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
                                            $ref: "#/components/schemas/Abonnement"
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
            tags: ["Abonnement"],
            summary: "Create a new subscription",
            description: "Create a new subscription with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createAbonnementRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Subscription created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Abonnement"
                                    }
                                }

                            }
                        }
                    }
                },
                "400": {
                    description: "Invalid input"
                }
            }
        }
    },
    "/abonnements/{id}": {
        get: {
            tags: ["Abonnement"],
            summary: "Get subscription by ID",
            description: "Retrieve a subscription by its unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the subscription"
                }
            ],
            responses: {
                "200": {
                    description: "Subscription found",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Abonnement"
                            }
                        }
                    }
                },
                "404": {
                    description: "Subscription not found"
                }
            }
        },
        patch: {
            tags: ["Abonnement"],
            summary: "Update subscription by ID",
            description: "Update the information of a subscription by its unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the subscription"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createAbonnementRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Subscription updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/abonnement"
                            }
                        }
                    }
                },
                "404": {
                    description: "Subscription not found"
                }
            }
        },
        delete: {
            tags: ["Abonnement"],
            summary: "Delete subscription by ID",
            description: "Delete a subscription by ITS unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the subscription"
                }
            ],
            responses: {
                "200": {
                    description: "Subscription deleted successfully"
                },
                "404": {
                    description: "Subscription not found"
                }
            }
        }
    }
}

export {
    abonnementsTags,
    abonnementsSchema,
    abonnementPath
}