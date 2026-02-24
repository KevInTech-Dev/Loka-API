import {OpenAPIV3} from "openapi-types";

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
                default: "",
                description: "Label of the property type"
            }
        },
        required: ["label"]
    }
}

const propertyTypePath: OpenAPIV3.PathsObject = {
    "/property-type": {
        get: {
            tags: ["PropertyType"],
            summary: "Get all property types",
            description: "Retrieve a list of all property types in the system",
            responses: {
                "200": {
                    description: "A list of property types",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/property-type"
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
            description: "Create a new property type with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/property-type"
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
                                $ref: "#/components/schemas/property-type"
                            }
                        }
                    }
                }
            }
        }
    },
    "/property-type/{id}": {
        get: {
            tags: ["PropertyType"],
            summary: "Get property type by ID",
            description: "Retrieve a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
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
                                $ref: "#/components/schemas/property-type"
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
            description: "Update the information of a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the property type"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/property-type"
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
                                $ref: "#/components/schemas/property-type"
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
            description: "Delete a property type by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the property type"
                }
            ],
            responses: {
                "200": {
                    description: "property type deleted successfully"
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