import { InvoiceType } from "@/enums/InvoiceTypeEnume";
import { PaymentMethodEnum } from "@/enums/PaymentMethodEnum";
import { PaymentProviderEnum } from "@/enums/PaymentProviderEnum";
import { PaymentStatusEnum } from "@/enums/PaymentStatusEnum";
import { OpenAPIV3 } from "openapi-types";

const paymentTags: OpenAPIV3.TagObject = {
	name: "Payment",
	description: "Operations related to payments management"
};

const paymentSchema: OpenAPIV3.ComponentsObject["schemas"] = {
	createPaymentFedapay: {
		type: "object",
		properties: {
			description: {
				type: "string",
				description: "Description of the transaction"
			},
			amount: {
				type: "number",
				description: "Number to send within the request"
			},
			currency: {
				type: "string",
				description: "Currency"
			}
		},
		required: ["description", "amount", "currency"]
	},
	fedaPayResponse: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Id of the transaction"
			},
			reference: {
				type: "string",
				description: "reference of the transaction"
			},
			amount: {
				type: "string",
				description: "Amount of the transaction"
			},
			description: {
				type: "string",
				description: "Description of the transaction"
			},
			callbackurl: {
				type: "string",
				description: "CallBackUrl of the transaction"
			},
			status: {
				type: "string",
				description: "Status of the transaction"
			},
			createdAt: {
				type: "string",
				description: "Created date of the transaction"
			},
			updatedAt: {
				type: "string",
				description: "Updated date of the transaction"
			},
		},
		required: ["id", "reference", "amount", "description", "callbackurl", "status", "createdAt", "updatedAt"]
	},
	createPaymentRequest: {
		type: "object",
		properties: {
			facture_type: {
				type: "string",
				enum: [...Object.values(InvoiceType)],
				description: "Invoice type to pay"
			},
			facture_id: {
				type: "string",
				format: "uuid",
				description: "Facture unique identifier"
			},
			payment_method: {
				type: "string",
				enum: [...Object.values(PaymentMethodEnum)],
				description: "Payment method"
			},
			payment_provider: {
				type: "string",
				enum: [...Object.values(PaymentProviderEnum)],
				default: PaymentProviderEnum.FEDAPAY,
				description: "Payment provider"
			},
			currency: {
				type: "string",
				enum: ["XOF", "EUR", "USD"],
				default: "XOF",
				description: "Payment currency"
			},
			payer_phone: {
				type: "string",
				description: "Payer phone number"
			},
			payer_email: {
				type: "string",
				format: "email",
				description: "Payer email"
			},
			payment_notes: {
				type: "string",
				description: "Additional payment notes"
			}
		},
		required: ["facture_type", "facture_id", "payment_method", "payer_phone"]
	},
	payment: {
		type: "object",
		properties: {
			id: { type: "string", format: "uuid" },
			payment_reference: { type: "string", example: "PAY-2026-0301" },
			landlord_id: { type: "string", format: "uuid", nullable: true },
			tenant_id: { type: "string", format: "uuid", nullable: true },
			facture_loy_id: { type: "string", format: "uuid", nullable: true },
			facture_ab_id: { type: "string", format: "uuid", nullable: true },
			facture_water_id: { type: "string", format: "uuid", nullable: true },
			facture_elec_id: { type: "string", format: "uuid", nullable: true },
			facture_mtn_id: { type: "string", format: "uuid", nullable: true },
			amount_paid: { type: "number", example: 100000 },
			currency: { type: "string", enum: ["XOF", "EUR", "USD"], example: "XOF" },
			payment_date: { type: "string", format: "date-time" },
			factureType: { type: "string", enum: [...Object.values(InvoiceType)] },
			payment_method: { type: "string", enum: [...Object.values(PaymentMethodEnum)] },
			payment_provider: { type: "string", enum: [...Object.values(PaymentProviderEnum)] },
			payment_status: { type: "string", enum: [...Object.values(PaymentStatusEnum)] },
			platform_commission: { type: "number", example: 2000 },
			landlord_amount: { type: "number", example: 98000 },
			payer_phone: { type: "string" },
			payer_email: { type: "string" },
			receitpt_number: { type: "string" },
			payment_notes: { type: "string", nullable: true },
			refund_reason: { type: "string", nullable: true },
			refund_at: { type: "string", format: "date-time", nullable: true },
			createdAt: { type: "string", format: "date-time" },
			updatedAt: { type: "string", format: "date-time" },
			facture_details: {
				type: "object",
				nullable: true,
				additionalProperties: true
			}
		}
	},
	paginatedPayment: {
		type: "object",
		properties: {
			page: { type: "integer", example: 1 },
			limit: { type: "integer", example: 10 },
			total: { type: "integer", example: 35 },
			data: {
				type: "array",
				items: {
					$ref: "#/components/schemas/payment"
				}
			}
		}
	}
};

const paymentPath: OpenAPIV3.PathsObject = {
	"/payments": {
		// post: {
		// 	tags: ["Payment"],
		// 	summary: "Create a payment",
		// 	security: [{ bearerAuth: [] }],
		// 	description: "Create a new payment for a specific facture",
		// 	requestBody: {
		// 		required: true,
		// 		content: {
		// 			"application/json": {
		// 				schema: {
		// 					$ref: "#/components/schemas/createPaymentRequest"
		// 				}
		// 			}
		// 		}
		// 	},
		// 	responses: {
		// 		"200": {
		// 			description: "Payment created successfully",
		// 			content: {
		// 				"application/json": {
		// 					schema: {
		// 						type: "object",
		// 						properties: {
		// 							data: {
		// 								$ref: "#/components/schemas/payment"
		// 							}
		// 						}
		// 					}
		// 				}
		// 			}
		// 		},
		// 		"400": {
		// 			description: "Invalid input or provider/currency incompatibility"
		// 		},
		// 		"401": {
		// 			description: "Unauthorized"
		// 		},
		// 		"404": {
		// 			description: "Facture not found"
		// 		}
		// 	}
		// },
		post: {
			tags: ["Payment"],
			summary: "Create a payment",
			security: [{ bearerAuth: [] }],
			description: "Create a new payment",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/createPaymentFedapay"
						}
					}
				}
			},
			responses: {
				"200": {
					description: "Payment created successfully",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										$ref: "#/components/schemas/fedaPayResponse"
									}
								}
							}
						}
					}
				},
				"400": {
					description: "Invalid input or provider/currency incompatibility"
				},
				"401": {
					description: "Unauthorized"
				},
				"404": {
					description: "Facture not found"
				}
			}
		},
		get: {
			tags: ["Payment"],
			summary: "Get payments with pagination",
			security: [{ bearerAuth: [] }],
			description: "Retrieve paginated payments list based on role visibility",
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
					description: "Paginated payments",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/paginatedPayment"
							}
						}
					}
				},
				"401": {
					description: "Unauthorized"
				}
			}
		}
	},
	"/payments/{id}": {
		get: {
			tags: ["Payment"],
			summary: "Get payment by ID",
			security: [{ bearerAuth: [] }],
			description: "Retrieve payment details by ID",
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: { type: "string", format: "uuid" },
					description: "Payment unique identifier"
				}
			],
			responses: {
				"200": {
					description: "Payment details",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										$ref: "#/components/schemas/payment"
									}
								}
							}
						}
					}
				},
				"401": {
					description: "Unauthorized"
				},
				"404": {
					description: "Payment not found"
				}
			}
		}
	}
};

export { paymentTags, paymentSchema, paymentPath };

