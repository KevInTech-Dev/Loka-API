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
export {
    authenticationTags,
    authenticationSchema,
    AuthentificationPath,
    registrationSchema,
    RegistrationPath
}