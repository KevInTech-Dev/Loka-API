import { OpenAPIV3 } from "openapi-types";
import { DataTypes } from "sequelize";

const unitLocationTags: OpenAPIV3.TagObject = {
    name: "UnitLocation",
    description: "Operations related to unit location management"
}

const unitLocationSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    UnitLocation: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "id of the unit location"
            },
            unitTypeId: {
                type: "string",
                format: "uuid",
                description: "The id of the unit type"
            },
            unitNumber: {
                type: "string",
                description: "The number of the unit"
            },
            unitName: {
                type: "string",
                description: "The name of unit"
            },
            floor: {
                type: "string",
                description: "The number of the floor of the unit"
            },
            surfaceArea: {
                type: "string",
                description: "surface of the unit"
            },
            isFurnished: {
                type: "string",
                description: "this is to specify if the unit is furnished or not"
            },
            amenities: {
                type: "string",
                description: "amenities"
            },
            electricityMeterId: {
                type: "string",
                description: "electricty meter id"
            },
            waterMeterId: {
                type: "string",
                description: "water meter id"
            },
            initialElectricityReading: {
                type: "string",
                description: "initial electricity reading"
            },
            initialWaterReading: {
                type: "string",
                description: "initial water reading"
            },
            monthlyRent: {
                type: "string",
                description: "price of the rent"
            },
            electricityIncluded: {
                type: "string",
                description: "this is to specify if electricity fees is included in the monthly rent"
            },
            waterIncluded: {
                type: "string",
                description: "this is to specify if water fees is included in the monthly rent"
            },
            unitStatus: {
                type: "string",
                description: ""
            },
            description: {
                type: "string",
                description: ""
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
        required: [
            "id",
            "unitTypeId",
            "unitNumber",
            "unitName",
            "surfaceArea",
            "isFurnished",
            "amenities",
            "electricityMeterId",
            "waterMeterId",
            "initialElectricityReading",
            "initialWaterReading",
            " monthlyRent",
            "electricityIncluded",
            "waterIncluded",
            "unitStatus",
            "description",
            "createdAt",
            "updatedAt"]
    },
    createUnitLocationRequest: {
        type: "object",
        properties: {
            unitTypeId: {
                type: "string",
                format: "uuid",
                description: "The id of the unit type"
            },
            unitNumber: {
                type: "string",
                example: 0,
                description: "The number of the unit"
            },
            unitName: {
                type: "string",
                example: "string",
                description: "The name of unit"
            },
            floor: {
                type: "number",
                example: 0,
                description: "The number of the floor of the unit"
            },
            surfaceArea: {
                type: "number",
                example: 0,
                description: "surface of the unit"
            },
            isFurnished: {
                type: "string",
                example: false,
                description: "this is to specify if the unit is furnished or not"
            },
            amenities: {
                type: "string",
                description: "amenities"
            },
            electricityMeterId: {
                type: "string",
                example: "string",
                description: "electricty meter id"
            },
            waterMeterId: {
                type: "string",
                example: "string",
                description: "water meter id"
            },
            initialElectricityReading: {
                type: "number",
                example: 0,
                description: "initial electricity reading"
            },
            initialWaterReading: {
                type: "number",
                example: 0,
                description: "initial water reading"
            },
            monthlyRent: {
                type: "number",
                example: 0,
                description: "price of the rent"
            },
            electricityIncluded: {
                type: "string",
                example: false,
                description: "this is to specify if electricity fees is included in the monthly rent"
            },
            waterIncluded: {
                type: "string",
                example: false,
                description: "this is to specify if water fees is included in the monthly rent"
            },
            unitStatus: {
                type: "string",
                example: "string",
                description: "Statu of the unit"
            },
            description: {
                type: "string",
                example: "string",
                description: "description of the unit"
            },
        },
        required: [
            "unitTypeId",
            "unitNumber",
            "unitName",
            "surfaceArea",
            "isFurnished",
            "amenities",
            "electricityMeterId",
            "waterMeterId",
            "initialElectricityReading",
            "initialWaterReading",
            " monthlyRent",
            "electricityIncluded",
            "waterIncluded",
            "unitStatus",
            "description",
        ]
    },
    paginatedUnitLocation: {
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
                    $ref: "#/components/schemas/UnitLocation"
                }
            }
        }
    }
}

const unitLocationPath: OpenAPIV3.PathsObject = {
    "/unitLocation": {
        get: {
            tags: ["UnitLocation"],
            summary: "Get all unit location with pagination",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a paginated list of all unit location in the system",
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
                    description: "A paginated list of unit",
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
                                            $ref: "#/components/schemas/UnitLocation"
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
            tags: ["UnitLocation"],
            summary: "Create a new unit location",
            security: [{ bearerAuth: [] }],
            description: "Create a unit location with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUnitLocationRequest"
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
                                        $ref: "#/components/schemas/UnitLocation"
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
    "/unitLocation/{id}": {
        get: {
            tags: ["UnitLocation"],
            summary: "Get unit location by ID",
            description: "Retrieve a unit location by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the unit location"
                }
            ],
            responses: {
                "200": {
                    description: "unit location found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/UnitLocation"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Unit location not found"
                }
            }
        },
        patch: {
            tags: ["UnitLocation"],
            summary: "Update unit location by ID",
            description: "Update the information of a unit location by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the unit location"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUnitLocationRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Unit location updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/UnitLocation"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Unit location not found"
                }
            }
        },
        delete: {
            tags: ["UnitLocation"],
            summary: "Delete unit location by ID",
            description: "Delete a unit location by their unique ID",
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
                    description: "Unit location not found"
                }
            }
        }
    }
}

export {
    unitLocationTags,
    unitLocationSchema,
    unitLocationPath
}