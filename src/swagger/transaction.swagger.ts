import { TransactionStatusEnum } from "@/enums/TransactionStatusEnum"
import { TransactionTypeEnum } from "@/enums/TransactionTypeEnum"
import { OpenAPIV3 } from "openapi-types"
import { tags } from ".";
import { InvoiceType } from "@/enums/InvoiceTypeEnume";


const transactionTags: OpenAPIV3.TagObject = {
    name: "Transaction",
    description: "Operations related to transactions management"
}

const TransactionSchema: OpenAPIV3.ComponentsObject["schemas"] = {
    initializeTransactionRequest: {
        type: "object",
        properties: {
            numero_facture: {
                type: "string",
                description: "Invoice Number"
            },
            type_facture: {
                type: "string",
                enum: [...Object.values(InvoiceType)],
            }
        },
        required: ["numero_facture", "type_facture"]
    },
    transactionResponse: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "Unique identifier of the transaction"
            },
            payment_id: {
                type: "string",
                format: "uuid",
                description: "Unique identifier of the payment associated with the transaction"
            },
            sender_id: {
                type: "string",
                format: "uuid",
                description: "Unique identifier of the sender"
            },
            transaction_type: {
                type: "string",
                enum: [...Object.values(TransactionTypeEnum)],
                description: "Type of the transaction"
            },
            transaction_status: {
                type: "string",
                description: "Status of the transaction"
            },
            transaction_reference: {
                type: "string",
                description: "Unique reference for the transaction"
            },
            transaction_date: {
                type: "string",
                format: "date-time",
                description: "Date and time when the transaction was initiated"
            },
            amount: {
                type: "number",
                format: "float",
                description: "Amount involved in the transaction"
            },
            currency: {
                type: "string",
                description: "Currency code (e.g., USD, EUR, XOF)"
            },
            description: {
                type: "string",
                description: "Description or notes about the transaction"
            },
            metadata: {
                type: "object",
                description: "Additional metadata related to the transaction"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Date and time when the transaction was created"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Date and time when the transaction was last updated"
            }
        }
    },

    PaginatedTransactionResponse: {
        type: "object",
        properties: {
            page: {
                type: "number",
                description: "Current page number"
            },
            limit: {
                type: "number",
                description: "Number of transactions per page"
            },
            data: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/transactionResponse"
                }
            }
        }
    }
};

const transactionPath: OpenAPIV3.PathsObject = {
    "/transactions": {
        post: {
            tags: ["Transaction"],
            summary: "Create a new transaction",
            security: [{ bearerAuth: [] }],
            description: "Create a new transaction for a specific payment",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/initializeTransactionRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Transaction created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/transactionResponse"
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Bad Request - Invalid input data or payment not found"
                }
            }
        },
        get: {
            tags: ["Transaction"],
            summary: "Get paginated list of transactions",
            security: [{ bearerAuth: [] }],
            description: "Retrieve a paginated list of transactions based on user role and ownership",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: { type: "integer", default: 1 },
                    description: "Page number"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 },
                    description: "Number of items per page"
                }
            ],
            responses: {
                "200": {
                    description: "Paginated list of transactions retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/PaginatedTransactionResponse"
                            }
                        }
                    }
                },
                "400": {
                    description: "Bad Request - Invalid pagination parameters"
                }
            }
        }
    },

    "/transactions/{id}": {
        get: {
            tags: ["Transaction"],
            summary: "Get transaction details by ID",
            security: [{ bearerAuth: [] }],
            description: "Retrieve detailed information about a specific transaction by its ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string", format: "uuid" },
                    description: "Unique identifier of the transaction"
                }
            ],
            responses: {
                "200": {
                    description: "Transaction details retrieved successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/transactionResponse"
                                    }
                                }
                            }
                        }
                    }
                },
                "400": {
                    description: "Bad Request - Invalid transaction ID format"
                },
                "404": {
                    description: "Not Found - Transaction with the specified ID does not exist or access is denied"
                }
            }
        }
    }
};

export {
    transactionPath,
    transactionTags,
    TransactionSchema
}