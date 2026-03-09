import { InvoiceType } from "@/enums/InvoiceTypeEnume"
import { StatusFactures } from "@/enums/StatusFacturesEnum"
import { OpenAPIV3 } from "openapi-types"

const factureLoyerTags: OpenAPIV3.TagObject = {
    name: "RentInvoice",
    description: "Operations related to rent invoice"
}

const factureLoyerSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    factureLoyer: {
        type: "object",
        properties: {
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the rent"
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
        required: ["totalAPayer", "idTenant", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes", "unitLocation"]
    },
    paginatedfactureLoyer: {
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
                    $ref: "#/components/schemas/factureLoyer"
                }
            }
        }
    },
    createfactureLoyer: {
        type: 'object',
        properties: {
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the rent"
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
        required: ["totalAPayer", "idTenant", "dateEcheance", "dateEmission", "invoiceType", "isTva", "numeroFacture", "status", "notes", "unitLocation"]
    }
}

const factureLoyerPath: OpenAPIV3.PathsObject = {
    "/facture-loyer": {
        get: {
            tags: ["RentInvoice"],
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
                    description: "A list of rent invoice",
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
                                            $ref: "#/components/schemas/factureLoyer"
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
            tags: ["RentInvoice"],
            summary: "Create a new invoice",
            description: "Create a new invoice with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createfactureLoyer"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "rent invoice created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureLoyer"
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
    "/facture-loyer/{id}": {
        get: {
            tags: ["RentInvoice"],
            summary: "Get rent invoice by ID",
            description: "Retrieve a rent invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the rent invoice"
                }
            ],
            responses: {
                "200": {
                    description: "rent invoice found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureLoyer"
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
            tags: ["RentInvoice"],
            summary: "Update rent invoice by ID",
            description: "Update the information of a rent invoice by their unique ID",
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
                            $ref: "#/components/schemas/createfactureLoyer"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "rent invoice updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureLoyer"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "rent invoice not found"
                }
            }
        },
        delete: {
            tags: ["RentInvoice"],
            summary: "Delete rent invoice by ID",
            description: "Delete rent invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the rent invoice"
                }
            ],
            responses: {
                "200": {
                    description: "rent invoice deleted successfully",
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
                    description: "rent invoice not found"
                }
            }
        }
    }
}

export {
    factureLoyerTags,
    factureLoyerSchema,
    factureLoyerPath
}