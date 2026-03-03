import { OpenAPIV3 } from "openapi-types";

const propertyUnitLocationTags: OpenAPIV3.TagObject = {
    name: "PropertyUnitLocation",
    description: "Operations related to property unit location management"
}

const propertyUnitLocationSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    propertyUnitLocation: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "id of property_unit_location"
            },
            unitLocationId: {
                type: "string",
                format: "uuid",
                description: "foreign key of unit location"
            },
            propertyId: {
                type: "string",
                format: "uuid",
                description: "foreign key of the property"
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
        required: ["id", "unitLocationId", "propertyId", "createdAt", "updatedAt"]
    },
    createPropertyUnitLocationRequest: {
        type: "object",
        properties: {
            unitLocationId: {
                type: "string",
                format: "uuid",
                description: "foreign key of unit location"
            },
            propertyId: {
                type: "string",
                format: "uuid",
                description: "foreign key of the property"
            },
        },
        required: ["unitLocationId", "propertyId"]
    },
    paginatedPropertyUnitLocation: {
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
                    $ref: "#/components/schemas/propertyUnitLocation"
                }
            }
        }
    }
}

const propertyUnitLocationPath: OpenAPIV3.PathsObject = {
    "/propertyUnitLocation": {
        get: {
            tags: ["PropertyUnitLocation"],
            summary: "Get all property unit location with pagination",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a paginated list of all property unit location in the system",
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
                                            $ref: "#/components/schemas/propertyUnitLocation"
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
            tags: ["PropertyUnitLocation"],
            summary: "Create a new property unit location",
            security: [{ bearerAuth: [] }],
            description: "Create a property unit location with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyUnitLocationRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Property unit location created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyUnitLocation"
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
    "/propertyUnitLocation/{id}": {
        get: {
            tags: ["PropertyUnitLocation"],
            summary: "Get property unit location by ID",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a property unit location by their unique ID",
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
                    description: "Property unit location found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyUnitLocation"
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
            tags: ["PropertyUnitLocation"],
            summary: "Update property unit location by ID",
            security: [{ bearerAuth: [] }],
            description: "Update the information of a property unit location by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property unit location"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyUnitLocationRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Property unit location updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyUnitLocation"
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
            tags: ["PropertyUnitLocation"],
            summary: "Delete property unit location by ID",
            security: [{ bearerAuth: [] }],
            description: "Delete a property unit location by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of property unit location"
                }
            ],
            responses: {
                "200": {
                    description: "property unit location deleted successfully",
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
    propertyUnitLocationTags,
    propertyUnitLocationSchema,
    propertyUnitLocationPath
}