import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { StatusFactures } from "@/enums/StatusFacturesEnum";
import { OpenAPIV3 } from "openapi-types";

const factureEauTags: OpenAPIV3.TagObject = {
    name: "WaterInvoice",
    description: "Operations related to water invoice"
}

const factureEauSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    factureEau: {
        type: "object",
        properties: {
            idReleveCompteur: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the releve compteur"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the water"
            },
            idTenant: {
                type: "string",
                format: "uuid",
                description: "Id that represent tenant"
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
            },
            unitLocation: {
                type: "string",
                format: "uuid",
                description: "This represent the id of unit location"
            }
        },
        required: ["idReleveCompteur", "totalAPayer", "idTenant", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes", "unitLocation"]
    },
    paginatedFactureEau: {
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
                    $ref: "#/components/schemas/factureEau"
                }
            }
        }
    },
    createFactureEau: {
        type: 'object',
        properties: {
            idReleveCompteur: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the releve compteur"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the water"
            },
            idTenant: {
                type: "string",
                format: "uuid",
                description: "Id that represent tenant"
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
            },
            unitLocation: {
                type: "string",
                format: "uuid",
                description: "This represent the id of unit location"
            }
        },
        required: ["idReleveCompteur", "totalAPayer", "idTenant", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes", "unitLocation"]
    }
}

const factureEauPath: OpenAPIV3.PathsObject = {
    "/facture-eau": {
        get: {
            tags: ["WaterInvoice"],
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
                    description: "A list of water invoice",
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
                                            $ref: "#/components/schemas/factureEau"
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
            tags: ["WaterInvoice"],
            summary: "Create a new invoice",
            description: "Create a new invoice with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createFactureEau"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Water invoice created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureEau"
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
    "/facture-eau/{id}": {
        get: {
            tags: ["WaterInvoice"],
            summary: "Get water invoice by ID",
            description: "Retrieve a water invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the water invoice"
                }
            ],
            responses: {
                "200": {
                    description: "Water invoice found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureEau"
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
            tags: ["WaterInvoice"],
            summary: "Update water invoice by ID",
            description: "Update the information of a water invoice by their unique ID",
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
                            $ref: "#/components/schemas/createFactureEau"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Water invoice updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureEau"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "water invoice not found"
                }
            }
        },
        delete: {
            tags: ["WaterInvoice"],
            summary: "Delete water invoice by ID",
            description: "Delete water invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the water invoice"
                }
            ],
            responses: {
                "200": {
                    description: "Water invoice deleted successfully",
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
                    description: "Water invoice not found"
                }
            }
        }
    }
}

export {
    factureEauTags,
    factureEauSchema,
    factureEauPath
}
