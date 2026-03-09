import { ContractTypeEnum } from "@/enums/ContractTypeEnum";
import { OpenAPIV3 } from "openapi-types";

const contractTags: OpenAPIV3.TagObject = {
    name: "Contract",
    description: "Operations related to contract Management"
}

const contractSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    contract: {
        type: "object",
        properties: {
            landlord_id: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of landlord"
            },
            property_id: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of the property"
            },
            unit_id: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of the unit"
            },
            tenant_id: {
                type: "string",
                format: "uuid",
                description: "The unique identifier of tenant"
            },
            contract_type: {
                type: "string",
                enum: [...Object.values(ContractTypeEnum)],
                description: "Fixed term | Renewable |Month to month",
            },
            contract_start_date: {
                type: "string",
                default: "2026-03-03",
                description: "Contract start date"
            },
            contract_end_date: {
                type: "string",
                default: "2027-03-03",
                description: "Contract end date"
            },
            monthly_rent: {
                type: "number",
                default: 0,
                description: "The monthly rent",
            },
            security_deposit:{
                type: "number",
                default: 0,
                description: "The security deposit",
            },
            rent_due_day: {
                type: "number",
                default: 0,
                description: "The rent due day",
            },
            late_fee_grace_days: {
                type: "number",
                default: 0,
                description: "The late fee grace day",
            },
            electricity_included: {
                type: 'boolean',
                default: false,
                description: "Deposit electricity",
            },
            water_included: {
                type: 'boolean',
                default: false,
                description: "Deposit water reading",
            },
            electricity_rate_per_kwh: {
                type: "number",
                default: 0,
                description: "The electricity rate per kwh",
            },
            water_rate_per_m3: {
                type: "number",
                default: 0,
                description: "The water rate per m3",
            },
            other_changes: {
                type: "object",
                description: "The changes",
            },
            initial_electricity_reading: {
                type: "number",
                default: 0,
                description: "The electricity reading",
            },
            initial_water_reading: {
                type: "number",
                default: 0,
                description: "The water reading",
            },
            auto_renewal: {
                type: "boolean",
                default: false,
                description: "Deposit auto renewal",
            },
            special_terms: {
                type: "string",
                default: "",
                description: "Special terms",
            },
        },
        required: ["landlord_id", "tenant_id","property_id", "unit_id", "contract_type" ,"contract_start_date", "contract_end_date", "monthly_rent", "security_deposit",  "rent_due_day","late_fee_grace_days", "electricity_included", "water_included",  "initial_electricity_reading", "initial_water_reading", "auto_renewal", "special_terms", ]
    },
    paginatedContract: {
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
                    $ref: "#/components/schemas/contract"
                }
            }
        }
    }
}

const contractPath: OpenAPIV3.PathsObject = {
    "/contracts": {
        get: {
            tags: ["Contract"],
            summary: "Get all contracts with pagination",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a paginated list of all contracts in the system",
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
                    description: "A paginated list of contracts",
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
                                            $ref: "#/components/schemas/contract"
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
            tags: ["Contract"],
            summary: "Create a new contract",
            security: [{ bearerAuth: [] }],
            description: "Create a new contract with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/contract"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Contract created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/contract"
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
    "/contracts/{id}": {
        get: {
            tags: ["Contract"],
            summary: "Get contract by ID",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a contract by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the contract"
                }
            ],
            responses: {
                "200": {
                    description: "Contract found successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/contract"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Contract not found"
                }
            }
        },
        patch: {
            tags: ["Contract"],
            summary: "Update contract by ID",
            security: [{ bearerAuth: [] }],
            description: "Update the information of a contract by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the contract"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/contract"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Contract updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/contract"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Contract not found"
                }
            }
        },
        delete: {
            tags: ["Contract"],
            summary: "Delete contract by ID",
            security: [{ bearerAuth: [] }],
            description: "Delete a contract by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the contract"
                }
            ],
            responses: {
                "200": {
                    description: "Contract deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/contract"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "Contract not found"
                }
            }
        }
    },
    '/contracts/contractDoc_url/:id':{
        patch: {
            tags: ["Contract"],
            summary: "Upload a signed contract document",
            // security: [{ bearerAuth: [] }],
            description: "Uploade contract document signed by landlord or tenant",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the contract"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                tenant_signature_url: {
                                    type: "string",
                                    format: "binary",
                                    description: "The signed contract document signed by tenant"
                                },
                                landlord_signature_url: {
                                    type: "string",
                                    format: "binary",
                                    description: "The signed contract document signed by landlord"
                                }
                            },
                        }
                    }
                }
            },
            responses:{
                "200" : {
                    description: "Signed contract uploaded successfully",
                    content: {
                        "application/json": {
                            schema:{
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/contract"
                                    }
                                }
                            }
                        }
                    }
                },
                "400" : {
                    description: "No file uploaded"
                },
                "404": {
                    description: "Contract not found"
                }
            }
        }
    }
}
export {
    contractPath,
    contractTags,
    contractSchema
}