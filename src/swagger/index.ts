import env from "@config/env";
import {OpenAPIV3} from "openapi-types";
import {userPath, userSchema, userTags} from "@/swagger/user.swagger";


export const tags: OpenAPIV3.TagObject[] = [
    userTags
];

export const paths: OpenAPIV3.PathsObject = {
    // Health endpoint
    '/health': {
        get: {
            tags: ['Health'],
            summary: 'Health check',
            description: 'Check if the API is running and healthy',
            security: [],
            responses: {
                '200': {
                    description: 'API is healthy',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {type: 'boolean', example: true},
                                    message: {type: 'string', example: 'API is healthy'},
                                    timestamp: {type: 'string', format: 'date-time'},
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    // Module paths
    ...userPath
};

export const schemas: OpenAPIV3.ComponentsObject['schemas'] = {
    ...userSchema,

};


export const swaggerSpec: OpenAPIV3.Document = {
    openapi: '3.0.0',
    info: {
        title: 'Rental Management API',
        version: '1.0.0'
        ,
        contact: {
            name: 'TAD IT Consulting',
            email: 'support@tad-it.consulting',
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
            description: 'Development server',
        },

    ],
    tags,
    components: {
        // securitySchemes,
        schemas,
        // responses,
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    paths,
};

export default swaggerSpec;
