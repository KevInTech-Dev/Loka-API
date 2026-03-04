import { OpenAPIV3 } from "openapi-types";

const authenticationTags: OpenAPIV3.TagObject = {
    name: "Authentification",
    description: "Operations related to subscription management"
}

const authenticationSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    Authentification: {
        type: "object",
        properties: {
            accessToken: {
                type: "string",
                description: "Access token"
            },
            refreshToken: {
                type: "string",
                description: "Refresh token"
            }
        },
        required: ["accessToken", "refreshToken"]
    },
    loginRequest: {
        type: "object",
        properties: {
            username: {
                type: "string",
                description: "Username of the user"
            },
            password: {
                type: "string",
                description: "The password of the user"
            }
        },
        required: ["username", "password"]
    }
}

const refreshTokenSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    Refresh: {
        type: "object",
        properties: {
            accessToken: {
                type: "string",
                description: "Access token"
            },
            refreshToken: {
                type: "string",
                description: "Refresh token"
            }
        },
        required: ["accessToken", "refreshToken"]
    },
    refreshRequest: {
        type: "object",
        properties: {
            id: {
                type: "string",
                description: "id of the refresh token"
            }
        },
        required: ["id"]
    }
}

const refreshTokenObjectSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    refreshToken: {
        type: "object",
        properties: {
            userId: {
                type: "string",
                description: "user id to reference the user associated"
            },
            token: {
                type: "string",
                description: "the token"
            },
            expiryDate: {
                type: "string",
                description: "the expiration date"
            },
            createdAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was created"
            },
            updatedAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was updated"
            }
        },
        required: ['updatedAt', 'createdAt', 'userId', 'expiryDate', 'token']
    }
}

const registrationSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    Registration: {
        type: "object",
        properties: {
            username: {
                type: "string",
                description: "Username of the user"
            },
            firstname: {
                type: "string",
                description: "User firstname"
            },
            lastname: {
                type: "string",
                description: "User lastname"
            },
            role: {
                type: "string",
                description: "User role"
            },
            email: {
                type: "string",
                description: "User email"
            },
            phoneNumber: {
                type: "string",
                description: "User phone number"
            },
            password: {
                type: "string",
                description: "The password of the user"
            },
            isActive: {
                type: "boolean",
                default: false,
                description: "User activity"
            },
            profilePhotoUrl: {
                type: "string",
                description: "User profile picture"
            },
            isEmailVerified: {
                type: "boolean",
                default: false,
                description: "User is email verified"
            },
            createdAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was created"
            },
            updatedAt: {
                type: "string",
                format: "data-time",
                description: "Timestamp when the property type was updated"
            }
        },
        required: ["username", "firstname", "lastname", "email", "password", "phoneNumber"]
    },
    registrationRequest: {
        type: "object",
        properties: {
            username: {
                type: "string",
                description: "Username of the user"
            },
            firstname: {
                type: "string",
                description: "User firstname"
            },
            lastname: {
                type: "string",
                description: "User lastname"
            },
            phoneNumber: {
                type: "string",
                description: "User phone number"
            },
            email: {
                type: "string",
                description: "User email"
            },
            password: {
                type: "string",
                description: "The password of the user"
            },
        },
        required: ["username", "firstname", "lastname", "email", "password", "phoneNumber"]
    },
}
const AuthentificationPath: OpenAPIV3.PathsObject = {
    "/auth/login": {
        post: {
            tags: ["Authentification"],
            summary: "Authentification of users",
            description: "Login of users",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/loginRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Subscription created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Authentification"
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
}

const RegistrationPath: OpenAPIV3.PathsObject = {
    "/auth/register": {
        post: {
            tags: ["Authentification"],
            summary: "Create a new subscription",
            description: "Create a new subscription with the provided information",
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/registrationRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "Subscription created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/Registration"
                            }
                        }
                    }
                }
            }
        }
    }
}

const RefreshTokenPath: OpenAPIV3.PathsObject = {
    "/auth/refresh/{id}": {
        post: {
            tags: ["Authentification"],
            summary: "Refresh token",
            description: "Refresh the session token",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of refresh token"
                }
            ],
            responses: {
                "201": {
                    description: "Refresh done successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/Refresh"
                                    }
                                }

                            }
                        }
                    }
                },
                "404": {
                    description: "Refresh token not sent"
                }
            }
        },
    }
}

const refreshTokenObjectPath: OpenAPIV3.PathsObject = {
    "/auth/get-all-refresh-token": {
        get: {
            tags: ["Authentification"],
            summary: "Get all refresh tokens with pagination",
            description: "Retrieve a paginated list of all refresh in the system",
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
                    description: "A paginated list of refresh token",
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
    }
}
export {
    authenticationTags,
    authenticationSchema,
    AuthentificationPath,
    registrationSchema,
    RegistrationPath,
    RefreshTokenPath,
    refreshTokenSchema,
    refreshTokenObjectSchema,
    refreshTokenObjectPath
}