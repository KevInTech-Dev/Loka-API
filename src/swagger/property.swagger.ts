import { OpenAPIV3 } from "openapi-types";

const propertyTags: OpenAPIV3.TagObject = {
    name: "Property",
    description: "Operations related to propertys management"
}

const propertyShema: OpenAPIV3.ComponentsObject['schemas'] = {
    property: {
        type: "object",
        properties: {
            label: {
                type: "string",
                description: "Label of the property"
            },
            type: {
                type: "string",
                format: "uuid",
                description: "Type of the property"
            },
            address: {
                type: "string",
                description: "Address of the property"
            },
            city: {
                type: "string",
                description: "City of the property"
            },
            district: {
                type: "string",
                description: "District of the property"
            },
            country: {
                type: "string",
                description: "Country of the property"
            },
            numberOfUnits: {
                type: "number",
                description: "Number of units in the property"
            },
            numberOfFloors: {
                type: "number",
                description: "Number of floors of the property"
            },
            yearBuilt: {
                type: "string",
                description: "The year the property was built"
            },
            description: {
                type: "string",
                description: "Description of the property"
            },
            electricityMeterNumber: {
                type: "string",
                description: "Electricity meter number of the property"
            },
            waterMeterNumber: {
                type: "string",
                description: "Water meter number of the property"
            },
            documents: {
                type: "string",
                nullable: true,
                description: "URL to documents of properties"
            },
            createdAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property was created"
            },
            updatedAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property was updated"
            }
        },
        required: ["label", "type", "address", "city", "district", "country", "numberOfUnits", "numberOfFloors", "yearBuilt", "description", "electricityMeterNumber", "waterMeterNumber", "createdAt", "updatedAt", "documents"]
    },
    createPropertyRequest: {
        type: "object",
        properties: {
            documents: {
                type: "string",
                format: "binary",
                description: "The document file to upload"
            },
            label: {
                type: "string",
                description: "Label of the property"
            },
            type: {
                type: "string",
                format: "uuid",
                description: "Type of the property"
            },
            address: {
                type: "string",
                description: "Address of the property"
            },
            city: {
                type: "string",
                description: "City of the property"
            },
            district: {
                type: "string",
                description: "District of the property"
            },
            country: {
                type: "string",
                description: "Country of the property"
            },
            numberOfUnits: {
                type: "number",
                description: "Number of units in the property"
            },
            numberOfFloors: {
                type: "number",
                description: "Number of floors of the property"
            },
            yearBuilt: {
                type: "string",
                description: "The year the property was built"
            },
            description: {
                type: "string",
                description: "Description of the property"
            },
            electricityMeterNumber: {
                type: "string",
                description: "Electricity meter number of the property"
            },
            waterMeterNumber: {
                type: "string",
                description: "Water meter number of the property"
            },
        },
        required: ["label", "type", "address", "city", "district", "country", "numberOfUnits", "numberOfFloors", "yearBuilt", "description", "electricityMeterNumber", "waterMeterNumber"]
    },
    paginatedProperty: {
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
                    $ref: "#/components/schemas/property"
                }
            }
        }
    }
}

const propertyPath: OpenAPIV3.PathsObject = {
    "/property": {
        get: {
            tags: ["Property"],
            summary: "Get all propertys",
            description: "Retrieve a list of all propertys in the system",
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
                    description: "A list of propertys",
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
                                            $ref: "#/components/schemas/property"
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
            tags: ["Property"],
            summary: "Create a new property",
            description: "Create a new property with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "property created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/property"
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
    "/property/{id}": {
        get: {
            tags: ["Property"],
            summary: "Get property by ID",
            description: "Retrieve a property by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            responses: {
                "200": {
                    description: "property found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/property"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "property not found"
                }
            }
        },
        patch: {
            tags: ["Property"],
            summary: "Update property by ID",
            description: "Update the information of a property by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createPropertyRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "property updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/property"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "property not found"
                }
            }
        },
        delete: {
            tags: ["Property"],
            summary: "Delete property by ID",
            description: "Delete a property by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            responses: {
                "200": {
                    description: "property deleted successfully",
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
                    description: "property not found"
                }
            }
        }
    },
    "/property/documents/{id}": {
        post: {
            tags: ["Property"],
            summary: "Add your property documents",
            description: "Upload a document for a property by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                documents: {
                                    type: "string",
                                    format: "binary",
                                    description: "The document file to upload"
                                }
                            },
                            required: ["documents"]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Document added successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/property"
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "No file uploaded"
                },
                "404": {
                    description: "Property not found"
                }
            }
        }
    }
}

export {
    propertyTags,
    propertyShema,
    propertyPath
}