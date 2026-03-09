import { InvoiceType } from "@/enums/InvoiceTypeEnume"
import { StatusFactures } from "@/enums/StatusFacturesEnum"
import { OpenAPIV3 } from "openapi-types"

const factureMaintenanceTags: OpenAPIV3.TagObject = {
    name: "MaintenanceInvoice",
    description: "Operations related to maintenance invoice"
}

const factureMaintenanceSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    factureMaintenance: {
        type: "object",
        properties: {
            maintenanceId: {
                type: "string",
                format: "uuid",
                description: "The id of maintenance"
            },
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the maintenance"
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
    paginatedFactureMaintenance: {
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
                    $ref: "#/components/schemas/factureMaintenance"
                }
            }
        }
    },
    createFactureMaintenance: {
        type: 'object',
        properties: {
            totalAPayer: {
                type: "number",
                description: "Amount to paye for the maintenance"
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

const factureMaintenancePath: OpenAPIV3.PathsObject = {
    "/facture-loyer": {
        get: {
            tags: ["MaintenanceInvoice"],
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
                                            $ref: "#/components/schemas/factureMaintenance"
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
            tags: ["MaintenanceInvoice"],
            summary: "Create a new invoice",
            description: "Create a new invoice with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createFactureMaintenance"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "maintenance invoice created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureMaintenance"
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
            tags: ["MaintenanceInvoice"],
            summary: "Get maintenance invoice by ID",
            description: "Retrieve a maintenance invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the maintenance invoice"
                }
            ],
            responses: {
                "200": {
                    description: "maintenance invoice found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureMaintenance"
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
            tags: ["MaintenanceInvoice"],
            summary: "Update maintenance invoice by ID",
            description: "Update the information of a maintenance invoice by their unique ID",
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
                            $ref: "#/components/schemas/createFactureMaintenance"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "maintenance invoice updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/factureMaintenance"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "maintenance invoice not found"
                }
            }
        },
        delete: {
            tags: ["MaintenanceInvoice"],
            summary: "Delete maintenance invoice by ID",
            description: "Delete maintenance invoice by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the maintenance invoice"
                }
            ],
            responses: {
                "200": {
                    description: "maintenance invoice deleted successfully",
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
                    description: "maintenance invoice not found"
                }
            }
        }
    }
}

export {
    factureMaintenanceTags,
    factureMaintenanceSchema,
    factureMaintenancePath
}