import { GenderEnum } from "@/enums/GenderEnum";
import { OpenAPIV3 } from "openapi-types";
import {userSchema} from "@/swagger/user.swagger";
import { idCardTypeEnum } from "@/enums/idCardTypeEnum";


const tenantTags: OpenAPIV3.TagObject = {
    name: "Tenant",
    description: "Operations related to tenant Managment"
}

const tenantSchema : OpenAPIV3.ComponentsObject['schemas'] = {
    tenant: {
        type: "object",
        properties: {
           ...userSchema["createUserRequest"]["properties"],
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
                description: "Le type de carte d'identité, CARTE_D_IDENTITE | PASSEPORT | CARTE_ELECTEUR | CERTIFICAT_NATIONALITE",
                enum: [...Object.values(idCardTypeEnum)]
            },
            id_card_number: {
                type: "string",
                default: "",
                description: "Numero de la carte"
            },
            id_card_front_url: {
                type: "string",
                nullable: true,
                format: "binary",
                description: "Photo recto de la carte"
            },
            id_card_back_url: {
                type: "string",
                nullable: true,
                format: "binary",
                description: "Photo verso de la carte"
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
         required: ["date_of_birth", "gender", "nationality", "phone_primary", "id_card_type", "id_card_number", ...userSchema["createUserRequest"]["required"]]
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
                        default: 10
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
            description: "Create a new tenant with the provide informations",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
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
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/tenant"
                                    }
                                }
                            }
                        }
                    }
                },
                "400" : {
                    description: "Invalide Input"
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
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
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
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/tenant"
                                    }
                                }
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
                        type: "string",
                        format: "uuid"
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
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/tenant"
                                    }
                                }
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
     },
     "/tenants/photo/{id}": {
        patch: {
            tags: ["Tenant"],
            summary: "Update tenant id card photo",
            description: "Upload id card photo for a tenant by their unique ID",
            parameters: [
                {
                    name:"id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the tenant"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                id_card_front_url: {
                                    type: "string",
                                    format: "binary",
                                    description: "The id front card photo file to upload"
                                },
                                id_card_back_url: {
                                    type: "string",
                                    format: "binary",
                                    description: "The id front card photo file to upload"
                                }
                            },
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "id card added successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/tenant"
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