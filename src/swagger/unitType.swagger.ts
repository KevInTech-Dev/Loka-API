import { OpenAPIV3 } from "openapi-types";

const unitTypeTags: OpenAPIV3.TagObject = {
    name: "UnitType",
    description: "Operations related to unit type management"
}

const unitTypeSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    unitType: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "Unique identifier of the unit type"
            },
            code: {
                type: "string",
                description: "code of the unit type"
            },
            label: {
                type: "string",
                description: "label of the unit type"
            },
            isActive: {
                type: "boolean",
                description: "property for activation of unit type"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was last updated"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was last updated"
            }
        },
        required: ["id", "code", "label", "isActive", "createdAt", "updatedAt"]
    },
    createUnitTypeRequest: {
        type: "object",
        properties: {
            code: {
                type: "string",
                example: "IMM-456",
                description: "code of the unit type"
            },
            label: {
                type: "string",
                example: "Studio | T1 | Bureau",
                description: "label of the unit type"
            },
        },
        required: ["code", "label"]
    },
    paginatedUnitTypes: {
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
                    $ref: "#/components/schemas/unitType"
                }
            }
        }
    }
}

const unitTypePath: OpenAPIV3.PathsObject = {
    "/unitType": {
        get: {
            tags: ["UnitType"],
            summary: "Get all unit type with pagination",
            description: "Retrieve a paginated list of all unit type in the system",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 1
                    },
                    description: "Page number (starting from 1)"
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
                    description: "A paginated list of unit type",
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
                                            $ref: "#/components/schemas/unitType"
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
            tags: ["UnitType"],
            summary: "Create a new unit type",
            description: "Create a new unit type with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUnitTypeRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Unit type created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/unitType"
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
    "/unitType/{id}": {
        get: {
            tags: ["UnitType"],
            summary: "Get unit type by ID",
            description: "Retrieve a unit type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the unit type"
                }
            ],
            responses: {
                "200": {
                    description: "Unit type found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/unitType"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Unit type not found"
                }
            }
        },
        patch: {
            tags: ["UnitType"],
            summary: "Update unit type by ID",
            description: "Update the information of a unit type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the unit type"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUnitTypeRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Unit type updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/unitType"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Unit type not found"
                }
            }
        },
        delete: {
            tags: ["UnitType"],
            summary: "Delete unit type by ID",
            description: "Delete a unit type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the unit type"
                }
            ],
            responses: {
                "200": {
                    description: "Unit type deleted successfully",
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
                    description: "Unit type not found"
                }
            }
        }
    }
}

export {
    unitTypeTags,
    unitTypeSchema,
    unitTypePath
}