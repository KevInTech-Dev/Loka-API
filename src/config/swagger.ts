/**
 * Swagger Configuration
 * API documentation setup with swagger-jsdoc
 */

import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Loka API",
      version: "1.0.0",
      description: "API de gestion locative - Rental Management SaaS Platform",
      contact: {
        name: "Loka API Support",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Serveur de développement",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Identifiant unique",
              example: 1,
            },
            firstName: {
              type: "string",
              description: "Prénom",
              example: "Jean",
            },
            lastName: {
              type: "string",
              description: "Nom de famille",
              example: "Dupont",
            },
            email: {
              type: "string",
              format: "email",
              description: "Adresse email",
              example: "jean.dupont@email.com",
            },
            phone: {
              type: "string",
              description: "Numéro de téléphone",
              example: "+33612345678",
            },
            role: {
              type: "string",
              enum: ["admin", "manager", "tenant", "owner"],
              description: "Rôle de l'utilisateur",
              example: "tenant",
            },
            isActive: {
              type: "boolean",
              description: "Compte actif",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        CreateUser: {
          type: "object",
          required: ["firstName", "lastName", "email"],
          properties: {
            firstName: {
              type: "string",
              example: "Jean",
            },
            lastName: {
              type: "string",
              example: "Dupont",
            },
            email: {
              type: "string",
              format: "email",
              example: "jean.dupont@email.com",
            },
            phone: {
              type: "string",
              example: "+33612345678",
            },
            role: {
              type: "string",
              enum: ["admin", "manager", "tenant", "owner"],
              example: "tenant",
            },
          },
        },
        UpdateUser: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              example: "Jean",
            },
            lastName: {
              type: "string",
              example: "Dupont",
            },
            email: {
              type: "string",
              format: "email",
              example: "jean.dupont@email.com",
            },
            phone: {
              type: "string",
              example: "+33612345678",
            },
            role: {
              type: "string",
              enum: ["admin", "manager", "tenant", "owner"],
              example: "tenant",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Une erreur est survenue",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
            message: {
              type: "string",
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {},
            },
            pagination: {
              type: "object",
              properties: {
                total: { type: "integer", example: 50 },
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                totalPages: { type: "integer", example: 5 },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts", "./src/modules/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
