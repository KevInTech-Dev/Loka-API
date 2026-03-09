import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";
import { OpenAPIV3 } from "openapi-types";

const factureAbonnementTags: OpenAPIV3.TagObject = {
    name: "SubscriptionInvoice",
    description: "Operations related to sunscription invoice"
}

const factureAbonnementSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    factureAbonnement: {
        type: "object",
        properties: {
            landlordId: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the landlord that make the subscription"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the subscription"
            },
            utilisateurAbonnement: {
                type: "string",
                format: "uuid",
                description: "Id that represent utilisateurAbonnement"
            },
            dateEcheance: {
                type: "string",
                description: "Due date"
            },
            dateEmission: {
                type: "string",
                description: "Date of making the invoice"
            },
            invoiceType: {
                type: "string",
                description: "FACTURE_LOYER|FACTURE_MAINTENANCE|FACTURE_EAU|FACTURE_ELEC|ABONNEMENT",
                enum: [...Object.values(InvoiceType)]
            },
            isTva: {
                type: "boolean",
                description: "Boolean value to add or not tva on the invoice",
            },
            numeroFacture: {
                type: "string",
                description: "Number of the invoice",
            },
            status: {
                type: "string",
                enum: [...Object.values(StatusFactures)],
                description: "EN_RETARD|EN_ATTENTE|PAYE",
            },
            notes: {
                type: "string",
                description: "If needed to add some notes to the invoice",
            }
        },
        required: ["landlordId", "totalAPayer", "utilisateurAbonnement", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes"]
    },
    paginatedFactureAbonnement: {
        type: "object",
        properties: {
            page: {
                type: "integer",
                description: ""
            },
            limit: {
                type: "integer",
                description: ""
            },
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/factureAbonnement"
                }
            }
        }
    },
    createFactureAbonnement: {
        type: 'object',
        properties: {
            landlordId: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the landlord that make the subscription"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the subscription"
            },
            utilisateurAbonnement: {
                type: "string",
                format: "uuid",
                description: "Id that represent utilisateurAbonnement"
            },
            dateEcheance: {
                type: "string",
                description: "Due date"
            },
            dateEmission: {
                type: "string",
                description: "Date of making the invoice"
            },
            invoiceType: {
                type: "string",
                description: "FACTURE_LOYER|FACTURE_MAINTENANCE|FACTURE_EAU|FACTURE_ELEC|ABONNEMENT",
                enum: [...Object.values(InvoiceType)],
                default: "ABONNEMENT|FACTURE_EAU|FACTURE_ELEC|FACTURE_LOYER|FACTURE_MAINTENANCE"
            },
            isTva: {
                type: "boolean",
                description: "Boolean value to add or not tva on the invoice",
            },
            numeroFacture: {
                type: "string",
                description: "Number of the invoice",
            },
            status: {
                type: "string",
                enum: [...Object.values(StatusFactures)],
                description: "EN_RETARD|EN_ATTENTE|PAYE",
                default: "EN_RETARD|EN_ATTENTE|PAYE"
            },
            notes: {
                type: "string",
                description: "If needed to add some notes to the invoice",
            }
        },
        required: ["landlordId", "totalAPayer", "utilisateurAbonnement", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes"]
    }
}

const factureAbonnementPath: OpenAPIV3.PathsObject = {
    "/facture-abonnement": {
        get: {
            tags: ["SubscriptionInvoice"],
            summary: "Get all invoice",
            description: "Retrieve a list of all invoice in the system",
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
                    description: "A list of subscription invoice",
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
                                            $ref: "#/components/schemas/factureAbonnement"
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
            tags: ["SubscriptionInvoice"],
            summary: "Create a new invoice type",
            description: "Create a new invoice with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createFactureAbonnement"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Subscription invoice created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureAbonnement"
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
    "/facture-abonnement/{id}": {
        get: {
            tags: ["SubscriptionInvoice"],
            summary: "Get subscription invoice by ID",
            description: "Retrieve a subscription invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the subscription invoice"
                }
            ],
            responses: {
                "200": {
                    description: "Subscription invoice found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureAbonnement"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Invoice not found"
                }
            }
        },
        patch: {
            tags: ["SubscriptionInvoice"],
            summary: "Update subscription invoice by ID",
            description: "Update the information of a subscription invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the invoice"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createFactureAbonnement"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Subscription invoice updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureAbonnement"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Subscription invoice not found"
                }
            }
        },
        delete: {
            tags: ["SubscriptionInvoice"],
            summary: "Delete subscription invoice by ID",
            description: "Delete subscription invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the subscription invoice"
                }
            ],
            responses: {
                "200": {
                    description: "Subscription invoice deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Subscription invoice not found"
                }
            }
        }
    }
}

export {
    factureAbonnementTags,
    factureAbonnementSchema,
    factureAbonnementPath
}
