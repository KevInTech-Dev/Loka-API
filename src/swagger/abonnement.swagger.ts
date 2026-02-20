import {OpenAPIV3} from "openapi-types";

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
            
            
        },
        required: ["planAbonnement", "prix", "detail"] 
    }
};
const abonnementPath: OpenAPIV3.PathsObject = {
    "/abonnements": {
        get: {
            tags: ["Abonnement"],
            summary: "Get all subscriptions",
            description: "Retrieve a list of all subscriptions in the system",
            responses: {
                "200": {
                    description: "A list of subscriptions",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/abonnementsTags"
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
                            $ref: "#/components/schemas/abonnement"
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
                                $ref: "#/components/schemas/abonnement"
                            }
                        }
                    }
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
                            $ref: "#/components/schemas/abonnement"
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