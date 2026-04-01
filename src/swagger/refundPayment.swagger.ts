import { RefundStatusEnum } from "@/enums/refundStatusEnum";
import { OpenAPIV3 } from "openapi-types";

const RefundTags : OpenAPIV3.TagObject = {
    name: "RefundPayment",
    description: "Opreration related to RefundPayment managment"
}

const RefundSchema : OpenAPIV3.ComponentsObject['schemas'] =  {
    RefundPaymentRequest : {
        type: 'object',
        properties: {
            refundReason : {
                type: 'string',
                description: "Refund Payment's reason",
                nullable: true
            }
        },
        required: ["refundReason"]
    },
    RefundPaymentResponse: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid',
                description: "Uniqu identifier of refundPayment",
            },
            transactionReference: {
                type: 'string',
                description: "Reference of the transaction"
            },
            paymentId : {
                type: 'string',
                format: 'uuid',
                description: "Payment id"
            },
            refundReason: {
                type: 'string',
                description: "Reference of the transaction"
            },
            refundAmount: {
                type: "integer",
                description: "Reference of the transaction"
            },
            refundStatus: {
                type: 'string',
                description: "Reference of the transaction",
                enum: [...Object.values(RefundStatusEnum)]
            },
        }
    },
}

const refundPaymentPath : OpenAPIV3.PathsObject = {
    "/refundPayment" : {
        post: {
            tags: ["RefundPayment"],
            summary: "Initialize a new refund payement",
            description: "A new refund payment initialisation",
            requestBody: {
                required: true,
                content: {
                    "application/json" : {
                        schema: {
                            $ref: "#/components/schemas/RefundPaymentRequest"
                        },
                    },
                },
            },
            responses: {
                "201" : {
                    description: "Refund payment information completed succesffully",
                    content: {
                        "application/json" : {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/RefundPaymentResponse"
                                    }
                                }
                            },
                        },
                    }
                },
                "400" : {
                    description: "Invalid input"
                },
                "404": {
                    description: "Unauthorized"
                }
            },
        },
        get: {
            tags:  ["RefundPayment"],
            summary: "Get all refund payment with pagination",
            description: "Get all refund payment with pagination",
            parameters: [
                {
                    name: "page",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 1,
                    },
                    description: "Page number(starting from 1)"
                },
                {
                    name: "limit",
                    in: "query",
                    schema: {
                        type: "integer",
                        default: 10,
                    },
                    description: "Number of items per page"
                },
            ],
            responses: {
                "200" : {
                    description: "A paginated list of refund payment",
                    content: {
                        "application/json" : {
                            schema: {
                                type: "object",
                                properties: {
                                    page: {
                                        type: "integer",
                                    },
                                    limit : {
                                        type: "integer"
                                    },
                                    data: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/RefundPaymentResponse"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "/refundPayment/{id}" : {
        get: {
            tags: ["RefundPayment"],
            summary: "Get a refund payment by id",
            description: "Get a refund payment by it's id",
            parameters:  [
                {
                    name: "id",
                    in: "path",
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the refund payment"
                }
            ],
            responses: {
                "200" : {
                    description: "Refund payment found",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: "#/components/schemas/RefundPaymentResponse"
                            }
                        }
                    }
                },
                "404" : {
                    description: "Refund payment not found"
                },
            },
        },
        patch: {
            tags: ["RefundPayment"],
            summary: "Approve refund payment",
            description: "Approve refund payment",
            parameters:  [
                {
                    name: "id",
                    in: "path",
                    schema: {
                        type: "string"
                    },
                    description: "The unique identifier of the refund payment"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json" : {
                        schema: {
                            type: "object",
                            properties: {
                                allowRefund: {
                                    type: "boolean",
                                    description: "Whether the refund is allowed or not"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200" : {
                    description: "Refund payment updated",
                    content: {
                        "application/json" : {
                            schema: {
                                $ref: "#/components/schemas/RefundPaymentResponse"
                            }
                        }
                    }
                },
                "400" : {
                    description: "Invalid request data"
                }
            }
        }
    }
}

export {
    RefundTags,
    RefundSchema,
    refundPaymentPath
}