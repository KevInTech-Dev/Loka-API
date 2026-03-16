import { CategoryMaintenanceRequest } from "@/enums/CategoryMaintenanceRequest";
import { Priority } from "@/enums/Priority";
import { StatutMaintenanceRequest } from "@/enums/StatutMaintenanceRequest";
import { changeStateOfMaintenance } from "@/modules/maintenance/maintenance.schema";
import { OpenAPIV3 } from "openapi-types";

const maintenanceTags: OpenAPIV3.TagObject = {
    name: "Maintenance",
    description: "Operations related to maintenance"
}

const maintenanceSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    maintenance: {
        type: "object",
        properties: {
            titre: {
                type: "string",
                description: "Title of the maintenance request"
            },
            locataireId: {
                type: "string",
                format: "uuid",
                description: "Id of the tenant who is making the maintenance request"
            },
            categorie: {
                type: "string",
                enum: [...Object.values(CategoryMaintenanceRequest)],
                description: "APPLIANCE|ELECTRICAL|HEATING|OTHERS|PLUMBING"
            },
            priority: {
                type: "string",
                description: "HIGH|LOW|MEDIUM|URGENT",
                enum: [...Object.values(Priority)],
            },
            responsable: {
                type: "string",
                format: "uuid",
                description: "Id of the technical manager"
            },
            date: {
                type: "string",
                description: "date of request"
            },
            statut: {
                type: "string",
                enum: [...Object.values(StatutMaintenanceRequest)],
                description: "ACCUSED|ONGOING|RESOLVE|SUBMITTED"
            }
        },
        required: ["titre", "categorie", "locataireId", "priority"]
    },
    paginatedMaintenance: {
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
                    $ref: "#/components/schemas/maintenance"
                }
            }
        }
    },
    createMaintenance: {
        type: "object",
        properties: {
            titre: {
                type: "string",
                description: "Title of the maintenance request"
            },
            locataireId: {
                type: "string",
                format: "uuid",
                description: "Id of the tenant who is making the maintenance request"
            },
            categorie: {
                type: "string",
                enum: [...Object.values(CategoryMaintenanceRequest)],
                default: "APPLIANCE | ELECTRICAL | HEATING | OTHERS | PLUMBING"
            },
            priority: {
                type: "string",
                default: "HIGH | LOW | MEDIUM | URGENT",
                enum: [...Object.values(Priority)],
            },
        },
        required: ["titre", "categorie", "locataireId", "priority"]
    },
    addTechnicalManager: {
        type: 'object',
        properties: {
            responsable: {
                type: 'string',
                format: 'uuid',
                description: "Id of the technical manager"
            },
            statut: {
                type: "string",
                enum: [...Object.values(StatutMaintenanceRequest)],
                default: "accused | ongoing | resolved | submitted "
            },
            priority: {
                type: "string",
                enum: [...Object.values(Priority)],
                default: "high | low | urgent | medium"
            }
        },
        required: ["responsable", "priority"]
    },
    changeStateOfMaintenance: {
        type: 'object',
        properties: {
            statut: {
                type: "string",
                enum: [...Object.values(StatutMaintenanceRequest)],
                default: "ongoing | submitted"
            }
        },
        required: ["statut"]
    }
}

const maintenancePath: OpenAPIV3.PathsObject = {
    "/maintenance-request": {
        get: {
            tags: ["Maintenance"],
            summary: "Get all Maintenance",
            description: "Retrieve a list of all Maintenance in the system",
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
                    description: "A list of Maintenance",
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
                                            $ref: "#/components/schemas/maintenance"
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
            tags: ["Maintenance"],
            summary: "Create a new Maintenance",
            description: "Create a new Maintenance with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createMaintenance"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Maintenance created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/maintenance"
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
    "/maintenance-request/{id}": {
        get: {
            tags: ["Maintenance"],
            summary: "Get Maintenance  by ID",
            description: "Retrieve a Maintenance  by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the Maintenance "
                }
            ],
            responses: {
                "200": {
                    description: "Maintenance found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/maintenance"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Maintenance not found"
                }
            }
        },
        patch: {
            tags: ["Maintenance"],
            summary: "Update Maintenance by ID",
            description: "Update the information of a Maintenance by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the Maintenance"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createMaintenance"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Maintenance updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/maintenance"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Maintenance  not found"
                }
            }
        },
        delete: {
            tags: ["Maintenance"],
            summary: "Delete Maintenance  by ID",
            description: "Delete Maintenance  by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the Maintenance "
                }
            ],
            responses: {
                "200": {
                    description: "Maintenance  deleted successfully",
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
                    description: "Maintenance not found"
                }
            }
        }
    },
    "/maintenance-request/{id}/add-technical-manager": {
        patch: {
            tags: ["Maintenance"],
            summary: "Update Maintenance by adding a technical manager and updating the statut",
            description: "Update the information of a Maintenance by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the Maintenance"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/addTechnicalManager"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Maintenance updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/maintenance"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Maintenance  not found"
                }
            }
        }
    },
    "/maintenance-request/{id}/change-state-maintenance": {
        patch: {
            tags: ["Maintenance"],
            summary: "Update Maintenance by updating the statut",
            description: "Update the information of a Maintenance by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the Maintenance"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/changeStateOfMaintenance"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Maintenance updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/maintenance"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Maintenance  not found"
                }
            }
        }
    }
}

export {
    maintenanceTags,
    maintenanceSchema,
    maintenancePath
}