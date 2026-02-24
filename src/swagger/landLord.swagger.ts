import { BusinessTypeEnum } from "@/enums/BusinessTypeEnum";
import { OpenAPIV3 } from "openapi-types";

const landlordTags: OpenAPIV3.TagObject = {
    name: "landLord",
    description: "Operations related to lanLord Mangement"
}

const landlordSchema : OpenAPIV3.ComponentsObject['schemas'] = {
    landlord: {
        type:"object",
        properties: {
            userId: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of the user (landlord owner)"
            },
            companyName: {
                type: "string",
                default: "",
                description: "Nom de l'entreprisse"
            },
            businessType: {
                type: "string",
                description: "agence | particulier | entreprise",
                enum: [...Object.values(BusinessTypeEnum)]
            },
            taxId: {
                type: "string",
                default: "",
                description: "Numero fiscal"
            },
            phonePrimary: {
                type: "string",
                default: "+228 XX XX XX XX",
                description: "Premier numero de téléphone du propriétaire"
            },
            phoneSecondary: {
                type: "string",
                default: "+228 XX XX XX XX",
                description: "Deuxième numero de téléphone du propriétaire"
            },
            address: {
                type: "string",
                default: "",
                description: "L'adresse du propriétaire"
            },
            city: {
                type: "string",
                default: "",
                description: "La ville du propriétaire",
            },
            country: {
                type: "string",
                default: "",
                description: "Le pays du propriétaire"
            }
        },
        required: ["userId", "businessType", "taxId", "phonePrimary"]
    },
    paginatedlandLord: {
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
                        $ref: "#/components/schemas/landlord"
                    }
                
            }
        }
    }
}

const landlordPath: OpenAPIV3.PathsObject = {
    "/landlords": {
        get: {
            tags: ["landLord"],
            summary: "Get all landlords with pagination",
            description: "Retrieve a paginated list of all landlords in the system",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 1
                    },
                    description: "Page number(startint from 1)"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: "10"
                    },
                    description: "Number of items per page"
                },
            ],
            responses: {
                "200": {
                    description: "A paginated list of landlords",
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
                                            $ref: "#/components/schemas/landlord"
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
            tags: ["landLord"],
            summary: "Create a new landlord",
            description: "Create a new landlord with the provide informations",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/landlord"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Landlord created succefully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/landlord"
                            }
                        }
                    }
                }
            }
        }
    },
    "/landlords/{id}": {
        get: {
            tags: ["landLord"],
            summary: "Get landlord by ID",
            description: "Retrieve a landlord by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the landlord"
                }
            ],
            responses: {
                "200": {
                    description: "Landlord found",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: "#/components/schemas/landlord"
                            }
                        }
                    }
                },
                "404": {
                    description: "landLord not found"
                }
            }
        },
        patch: {
            tags: ["landLord"],
            summary: "Update landlord by ID",
            description: "Update the information of the landlord by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the landlord"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/landlord"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Landlord updated successfully",
                    content: {
                        "application/json" :{
                            schema: {
                                $ref: "#/components/schemas/landlord"
                            }
                        }
                    }
                },
                "400": {
                    description: "landlord not found"
                }
            }
        },
        delete: {
            tags: ["landLord"],
            summary: "Delete landlord by ID",
            description: "Delete a landlord by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifiant of the landlord"
                }
            ],
            responses: {
                "200": {
                    description: "Landlord deleted succefully"
                },
                "404": {
                    description: "Landlord not found"
                }
            }
        }
    }
}

export {
    landlordTags,
    landlordSchema,
    landlordPath
}