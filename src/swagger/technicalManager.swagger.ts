import { OpenAPIV3 } from "openapi-types";

const technicalManagerTags: OpenAPIV3.TagObject = {
    name: "TechnicalManager",
    description: "Operations related to technical Manager"
}

const technicalManagerSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    technicalManager: {
        type: "object",
        properties: {
            title: {
                type: "string",
                description: "Attriute of the technical manager"
            },
            name: {
                type: "string",
                description: "Name of the technical manager"
            },
            contact: {
                type: "string",
                description: "Contact of the technical manager"
            }

        },
        required: ["title", "name", "contact"]
    },
    paginatedTechnicalManager: {
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
                    $ref: "#/components/schemas/technicalManager"
                }
            }
        }
    },
    createTechnicalManager: {
        type: "object",
        properties: {
            title: {
                type: "string",
                description: "Attriute of the technical manager"
            },
            name: {
                type: "string",
                description: "Name of the technical manager"
            },
            contact: {
                type: "string",
                description: "Contact of the technical manager"
            }

        },
        required: ["title", "name", "contact"]
    }
}

const technicalManagerPath: OpenAPIV3.PathsObject = {
    "/technicalManager": {
        get: {
            tags: ["TechnicalManager"],
            summary: "Get all TechnicalManager",
            description: "Retrieve a list of all TechnicalManager in the system",
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
                },
                {
                    name: "search",
                    in: "query",
                    schema: {
                        type: "string",
                    },
                    description: "Item to search"
                },
                {
                    name: "sortBy",
                    in: "query",
                    schema: {
                        type: "string",
                        default: 'createdAt'
                    },
                    description: "Attribute to use to sort"
                },
                {
                    name: "sortOrder",
                    in: "query",
                    schema: {
                        type: "string",
                        enum: ['desc', 'asc']
                    },
                    description: "Order of item to sort"
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
                                            $ref: "#/components/schemas/technicalManager"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        // post: {
        //     tags: ["TechnicalManager"],
        //     summary: "Create a new TechnicalManager",
        //     description: "Create a new TechnicalManager with the provided information",
        //     requestBody: {
        //         required: true,
        //         content: {
        //             "application/json": {
        //                 schema: {
        //                     $ref: "#/components/schemas/createTechnicalManager"
        //                 }
        //             }
        //         }
        //     },
        //     responses: {
        //         "201": {
        //             description: "Maintenance created successfully",
        //             content: {
        //                 "application/json": {
        //                     schema: {
        //                         type: "object",
        //                         properties: {
        //                             data: {
        //                                 $ref: "#/components/schemas/technicalManager"
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         },
        //         "400": {
        //             description: "Invalid input"
        //         }
        //     }
        // }
    },
    "/technicalManager/{id}": {
        get: {
            tags: ["TechnicalManager"],
            summary: "Get technicalManager  by ID",
            description: "Retrieve a technicalManager  by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the technicalManager "
                }
            ],
            responses: {
                "200": {
                    description: "technicalManager found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/technicalManager"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "TechnicalManager not found"
                }
            }
        },
        patch: {
            tags: ["TechnicalManager"],
            summary: "Update technicalManager by ID",
            description: "Update the information of a technicalManager by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the technicalManager"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createTechnicalManager"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "technicalManager updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/technicalManager"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "technicalManager  not found"
                }
            }
        },
        delete: {
            tags: ["TechnicalManager"],
            summary: "Delete technical Manager  by ID",
            description: "Delete technical Manager  by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the technical Manager "
                }
            ],
            responses: {
                "200": {
                    description: "technical Manager  deleted successfully",
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
                    description: "technical Manager not found"
                }
            }
        }
    }
}

export {
    technicalManagerTags,
    technicalManagerSchema,
    technicalManagerPath
}