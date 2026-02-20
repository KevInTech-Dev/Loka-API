import {OpenAPIV3} from "openapi-types";

const userTags: OpenAPIV3.TagObject = {
    name: "User",
    description: "Operations related to user management"
}

const userShema: OpenAPIV3.ComponentsObject['schemas'] = {
    user: {
        type: "object",
        properties: {
            usename: {
                type: "string",
                default: "",
                description: "Name of the user"
            },
            email: {
                type: "string",
                default: 'user@fmail.com',
                description: "Email address of the user"
            },
            password: {
                type: "string",
                default: "P@$$w0rd",
                description: "Password for the user account"
            }
        },
        required: ["username", "email", "password"]
    }
}

const userPath: OpenAPIV3.PathsObject = {
    "/users": {
        get: {
            tags: ["User"],
            summary: "Get all users",
            description: "Retrieve a list of all users in the system",
            responses: {
                "200": {
                    description: "A list of users",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    $ref: "#/components/schemas/user"
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
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/user"
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
                                $ref: "#/components/schemas/user"
                            }
                        }
                    }
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
                        type: "string"
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
                                $ref: "#/components/schemas/user"
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
                        type: "string"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/user"
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
                                $ref: "#/components/schemas/user"
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
                        type: "string"
                    },
                    description: "The unique identifier of the user"
                }
            ],
            responses: {
                "200": {
                    description: "User deleted successfully"
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
    userShema,
    userPath
}