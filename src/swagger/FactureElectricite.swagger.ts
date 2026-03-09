import { InvoiceType } from "@/enums/InvoiceTypeEnume"
import { StatusFactures } from "@/enums/StatusFacturesEnum"
import { OpenAPIV3 } from "openapi-types"

const factureElectriciteTags: OpenAPIV3.TagObject = {
    name: "ElectricityInvoice",
    description: "Operations related to electricity invoice"
}

const factureElectriciteSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    factureElectricite: {
        type: "object",
        properties: {
            idReleveCompteur: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the releve compteur"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the electricity"
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
    paginatedFactureElectricite: {
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
                    $ref: "#/components/schemas/factureElectricite"
                }
            }
        }
    },
    createFactureElectricite: {
        type: 'object',
        properties: {
            idReleveCompteur: {
                type: "string",
                format: "uuid",
                description: "This represent the id of the releve compteur"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the electricity"
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

const factureElectricitePath: OpenAPIV3.PathsObject = {
    "/facture-electricite": {
        get: {
            tags: ["ElectricityInvoice"],
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
                    description: "A list of electricity invoice",
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
                                            $ref: "#/components/schemas/factureElectricite"
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
            tags: ["ElectricityInvoice"],
            summary: "Create a new invoice",
            description: "Create a new invoice with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createFactureElectricite"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "electricity invoice created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureElectricite"
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
    "/facture-electricite/{id}": {
        get: {
            tags: ["ElectricityInvoice"],
            summary: "Get electricity invoice by ID",
            description: "Retrieve a electricity invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the electricity invoice"
                }
            ],
            responses: {
                "200": {
                    description: "electricity invoice found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureElectricite"
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
            tags: ["ElectricityInvoice"],
            summary: "Update electricity invoice by ID",
            description: "Update the information of a electricity invoice by their unique ID",
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
                            $ref: "#/components/schemas/createFactureElectricite"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "electricity invoice updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureElectricite"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "electricity invoice not found"
                }
            }
        },
        delete: {
            tags: ["ElectricityInvoice"],
            summary: "Delete electricity invoice by ID",
            description: "Delete electricity invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the electricity invoice"
                }
            ],
            responses: {
                "200": {
                    description: "electricity invoice deleted successfully",
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
                    description: "electricity invoice not found"
                }
            }
        }
    }
}

export {
    factureElectriciteTags,
    factureElectriciteSchema,
    factureElectricitePath
}