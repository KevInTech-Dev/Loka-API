import { OpenAPIV3 } from "openapi-types";

const propertyTypeTags: OpenAPIV3.TagObject = {
    name: "PropertyType",
    description: "Operations related to property types management"
}

const propertyTypeShema: OpenAPIV3.ComponentsObject['schemas'] = {
    propertyType: {
        type: "object",
        properties: {
            label: {
                type: "string",
                description: "Label of the property type"
            },
            createdAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was created"
            },
            updatedAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was updated"
            }
        },
        required: ["label"]
    },
    createPropertyTypeRequest: {
        type: "object",
        properties: {
            label: {
                type: "string",
                description: "MAISON DE LA STAR"
            }
        },
        required: ["label"]
    },
    paginatedPropertyType: {
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
                    $ref: "#/components/schemas/propertyType"
                }
            }
        }
    }
}
const propertyTypePath: OpenAPIV3.PathsObject = {
    "/property-type": {
        get: {
            tags: ["PropertyType"],
            summary: "Get all property types",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a list of all property types in the system",
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
                    description: "A list of property types",
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
                                            $ref: "#/components/schemas/propertyType"
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
            tags: ["PropertyType"],
            summary: "Create a new property type",
            security: [{ bearerAuth: [] }],
            description: "Create a new property type with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyTypeRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Property type created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyType"
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
    "/property-type/{id}": {
        get: {
            tags: ["PropertyType"],
            summary: "Get property type by ID",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property type"
                }
            ],
            responses: {
                "200": {
                    description: "Property Type found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyType"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Property type not found"
                }
            }
        },
        patch: {
            tags: ["PropertyType"],
            summary: "Update property type by ID",
            security: [{ bearerAuth: [] }],
            description: "Update the information of a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property type"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyTypeRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Property type updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/propertyType"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Property type not found"
                }
            }
        },
        delete: {
            tags: ["PropertyType"],
            summary: "Delete property type by ID",
            security: [{ bearerAuth: [] }],
            description: "Delete a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property type"
                }
            ],
            responses: {
                "200": {
                    description: "property type deleted successfully",
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
                    description: "property type not found"
                }
            }
        }
    }
}

export {
    propertyTypeTags,
    propertyTypeShema,
    propertyTypePath
}