import {OpenAPIV3} from "openapi-types";

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
                default: "",
                description: "Label of the property"
            },
            type : {
                type: "string",
                default:"",
                description: "Type of the property"
            },
            address : {
                type: "string",
                default:"",
                description: "Address of the property"
            },
            city : {
                type: "string",
                default:"",
                description: "City of the property"
            },
            district : {
                type: "string",
                default:"",
                description: "District of the property"
            },
            country : {
                type: "string",
                default:"",
                description: "Country of the property"
            },
            numberOfUnits : {
                type: "string",
                default:"",
                description: "Number of units in the property"
            },
            numberOfFloors : {
                type: "string",
                default:"",
                description: "Number of floors of the property"
            },
            yearBuilt : {
                type: "string",
                default:"",
                description: "The year the property was built"
            },
            description : {
                type: "string",
                default:"",
                description: "Description of the property"
            },
            electricityMeterNumber : {
                type: "string",
                default:"",
                description: "Electricity meter number of the property"
            },
            waterMeterNumber : {
                type: "string",
                default:"",
                description: "Water meter number of the property"
            },
            documents : {
                type: "string",
                default:"",
                description: "documents of the property"
            },
        },
        required: ["label","label","type","address","city","district" ,"country","numberOfUnits","numberOfFloors","yearBuilt","description","electricityMeterNumber","waterMeterNumber","documents"]
    }
}

const propertyPath: OpenAPIV3.PathsObject = {
    "/property": {
        get: {
            tags: ["Property"],
            summary: "Get all propertys",
            description: "Retrieve a list of all propertys in the system",
            responses: {
                "200": {
                    description: "A list of propertys",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/property"
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
                            $ref: "#/components/schemas/property"
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
                                $ref: "#/components/schemas/property"
                            }
                        }
                    }
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
                        type: "string"
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
                                $ref: "#/components/schemas/property"
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
                        type: "string"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/property"
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
                                $ref: "#/components/schemas/property"
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
                        type: "string"
                    },
                    description: "The unique identifier of the property"
                }
            ],
            responses: {
                "200": {
                    description: "property deleted successfully"
                },
                "404": {
                    description: "property not found"
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