import { OpenAPIV3 } from "openapi-types";

const userTags: OpenAPIV3.TagObject = {
    name: "User",
    description: "Operations related to user management"
}

const userSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    user: {
        type: "object",
        properties: {
            id: {
                type: "string",
                format: "uuid",
                description: "Unique identifier of the user"
            },
            firstname: {
                type: "string",
                description: "First name of the user"
            },
            lastname: {
                type: "string",
                description: "Last name of the user"
            },
            email: {
                type: "string",
                format: "email",
                description: "Email address of the user"
            },
            password: {
                type: "string",
                description: "Password for the user account (hashed in response)"
            },
            role: {
                type: "string",
                enum: ["locataire", "proprietaire", "admin"],
                description: "Role of the user"
            },
            isActive: {
                type: "boolean",
                description: "Whether the user account is active"
            },
            profilePhotoUrl: {
                type: "string",
                nullable: true,
                description: "URL to the user's profile photo"
            },
            isEmailVerified: {
                type: "boolean",
                description: "Whether the user's email has been verified"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was created"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                description: "Timestamp when the user was last updated"
            }
        },
        required: ["id", "email", "role", "isActive", "isEmailVerified", "createdAt", "updatedAt"]
    },
    createUserRequest: {
        type: "object",
        properties: {
            photo: {
                type: "string",
                format: "binary",
                description: "The profile photo file to upload"
            },
            email: {
                type: "string",
                format: "email",
                example: "user@example.com",
                description: "Email address of the user"
            },
            password: {
                type: "string",
                example: "P@$$w0rd123",
                description: "Password for the user account"
            },
            username: {
                type: "string",
                description: "Optional username"
            },
            firstname: {
                type: "string",
                description: "Optional first name"
            },
            lastname: {
                type: "string",
                description: "Optional last name"
            },
        },
        required: ["photo", "email", "password", "username"]
    },
    paginatedUsers: {
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
                    $ref: "#/components/schemas/user"
                }
            }
        }
    }
}

const userPath: OpenAPIV3.PathsObject = {
    "/users": {
        get: {
            tags: ["User"],
            summary: "Get all users with pagination",
            description: "Retrieve a paginated list of all users in the system",
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
                    description: "A paginated list of users",
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
                                            $ref: "#/components/schemas/user"
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
            tags: ["User"],
            summary: "Create a new user",
            description: "Create a new user with the provided information",
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/createUserRequest"
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "User created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/user"
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
    "/users/{id}": {
        get: {
            tags: ["User"],
            summary: "Get user by ID",
            description: "Retrieve a user by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            responses: {
                "200": {
                    description: "User found",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/user"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "User not found"
                }
            }
        },
        patch: {
            tags: ["User"],
            summary: "Update user by ID",
            description: "Update the information of a user by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/createUserRequest"
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "User updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/user"
                                    }
                                }
                            }
                        }
                    }
                },
                "404": {
                    description: "User not found"
                }
            }
        },
        delete: {
            tags: ["User"],
            summary: "Delete user by ID",
            description: "Delete a user by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            responses: {
                "200": {
                    description: "User deleted successfully",
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
                    description: "User not found"
                }
            }
        }
    },
    "/users/photo/{id}": {
        post: {
            tags: ["User"],
            summary: "Add profile photo to user",
            description: "Upload a profile photo for a user by their unique ID",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: {
                        type: "string",
                        format: "uuid"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                photo: {
                                    type: "string",
                                    format: "binary",
                                    description: "The profile photo file to upload"
                                }
                            },
                            required: ["photo"]
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Profile photo added successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    data: {
                                        $ref: "#/components/schemas/user"
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
                    description: "User not found"
                }
            }
        }
    }
}

export {
    userTags,
    userSchema,
    userPath
}