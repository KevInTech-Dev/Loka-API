import { GenderEnum } from "@/enums/GenderEnum";
import { OpenAPIV3 } from "openapi-types";


const tenantTags: OpenAPIV3.TagObject = {
    name: "Tenant",
    description: "Operations related to tenant Mangement"
}

const tenantSchema : OpenAPIV3.ComponentsObject['schemas'] = {
    tenant: {
        type: "object",
        properties: {
            userId: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of the user (landlord owner)"
            },
            date_of_birth: {
                type: "string",
                format: "date",
                default: "1990-01-01"
            },
            gender: {
                type: "string",
                description:"masculin | feminin",
                enum: [...Object.values(GenderEnum)]
            },
            nationality: {
                type: "string",
                default: "",
                description: "Nationalité du locataire"
            },
            phone_primary: {
                type: "string",
                default: "+228 XX XX XX XX",
                description: "Premier numero de téléphone du propriétaire"
            },
            phone_secondary: {
                type: "string",
                default: "+228 XX XX XX XX",
                description: "Deuxième numero de téléphone du propriétaire"
            },
            id_card_type: {
                type: "string",
                default: "",
                description: "Le type de carte d'identité"
            },
            id_card_number: {
                type: "string",
                default: "",
                description: "Numero de la carte"
            },
            id_card_front_url: {
                type: "string",
                default: "",
                description: "Photo recto"
            },
            id_card_back_url: {
                type: "string",
                default: "",
                description: "Photo verso"
            },
            occupation: {
                type: "string",
                default: "",
                description: "Profession du locataire"
            },
            employer_name: {
                type: "string",
                default: "",
                description: "Nom de l'employeur"
            },
            employer_contact: {
                type: "string",
                default: "",
                description: "Numero de l'employeur"
            },
            emergency_contact_name: {
                type: "string",
                default: "",
                description: "Nom de la personne à prévenir"
            },
            emergency_contact_phone : {
                type: "string",
                default: "",
                description: "Numero de la personne à prévenir"
            },
            emergency_contact_relationship : {
                type: "string",
                default: "",
                description: "Relatioin avec la personne à prévenir"
            }
        },
        required: ["userId", "date_of_birth", "gender", "nationality", "phone_primary", "id_card_type", "id_card_number", "id_card_front_url", "id_card_back_url"]
    },

    paginatedTenant: {
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
                        $ref: "#/components/schemas/tenant"
                    }     
            }
        }
    }
}

const tenantPath: OpenAPIV3.PathsObject = {
    "/tenants": {
        get: {
            tags: ["Tenant"],
            summary: "Get all tenants with pagination",
            description: "Retrieve a paginated list of all tenants in the system",
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
                    description: "A paginated list of tenants",
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
                                            $ref: "#/components/schemas/tenant"
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
            tags: ["Tenant"],
            summary: "Create a new tenant",
            description: "Create a new landlord with the provide informations",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/tenant"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Tenant created succefully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/tenant"
                            }
                        }
                    }
                }
            }
        }
     },
     "/tenants/{id}": {
        get: {
            tags: ["Tenant"],
            summary: "Get tenant by ID",
            description: "Retrieve a tenant by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the tenant"
                }
            ],
            responses: {
                "200": {
                    description: "Tenant found",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: "#/components/schemas/tenant"
                            }
                        }
                    }
                },
                "404": {
                    description: "Tenant not found"
                }
            }
        },
        patch: {
            tags: ["Tenant"],
            summary: "Update tenant by ID",
            description: "Update the information of the tenant by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the tenant"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/tenant"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Tenant updated successfully",
                    content: {
                        "application/json" :{
                            schema: {
                                $ref: "#/components/schemas/tenant"
                            }
                        }
                    }
                },
                "400": {
                    description: "tenant not found"
                }
            }
        },
        delete: {
            tags: ["Tenant"],
            summary: "Delete tenant by ID",
            description: "Delete a tenant by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifiant of the tenant"
                }
            ],
            responses: {
                "200": {
                    description: "Tenant deleted succefully"
                },
                "404": {
                    description: "Tenant not found"
                }
            }
        }
     }
    }

    export {
        tenantTags,
        tenantSchema,
        tenantPath
    }