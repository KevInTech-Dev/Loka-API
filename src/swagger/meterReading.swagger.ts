import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { OpenAPIV3 } from "openapi-types";

const meterReadingTags: OpenAPIV3.TagObject = {
    name: 'MeterReading',
    description: 'Operations related to MeterReading management',
};

const meterReadingSchema: OpenAPIV3.ComponentsObject['schemas'] = {
    meterReading: {
        type: 'object',
            properties: {
                landlord_id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'The unique identifier of landlord',
                },
                property_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'The unique identifier of the property',
                },
                unit_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'The unique identifier of the unit',
                },
                tenant_id: {
                  type: 'string',
                  format: 'uuid',
                  description: 'The unique identifier of tenant',
                },
                meter_type: {
                    type: 'string',
                    enum: [...Object.values(MeterTypeEnum)],
                    description: 'Electricity | Water',
                },
                meter_value: {
                    type: 'number',
                    description: 'Meter value',
                },
            },
            required: ['landlord_id', 'tenant_id', 'property_id', 'unit_id', 'meterValue'],
    },
    UpdatemeterReading: {
        type: 'object',
        properties: {
            meter_type: {
                type: 'string',
                enum: [...Object.values(MeterTypeEnum)],
                description: 'Electricity | Water',
            },
            meter_value: {
                type: 'number',
                description: 'Meter value',
            },
            reading_date: {
                type: 'string',
                default: '2026-03-14',
                description: 'Meter reading date'
            },
        },
        required: ['meter_type', 'meter_value', 'reading_date']
    }
}

const meterReadingPath: OpenAPIV3.PathsObject = {
    '/meterReading': {
        get: {
            tags: ['MeterReading'],
            summary: 'Get all meter reading with pagination',
            security: [{ bearerAuth: [] }],
            description: 'Retrieve a paginated list of all meter reading',
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    schema: {
                      type: 'integer',
                      default: 1,
                    },
                    description: 'Page number (starting from 1)',
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: {
                      type: 'integer',
                      default: 10,
                    },
                    description: 'Number of items per page',
                },
            ],
            responses: {
                '200': {
                  description: 'A paginated list of meter reading',
                  content: {
                    "application/json": {
                      schema: {
                        type: 'object',
                        properties: {
                          page: {
                            type: 'integer',
                          },
                          limit: {
                            type: 'integer',
                          },
                          data: {
                            type: 'array',
                            items: {
                              $ref: '#/components/schemas/meterReading',
                            },
                          },
                        },
                      },
                    },
                  },
                },
            },
        },
        post: {
          tags: ['MeterReading'],
          summary: 'Create a new meter reading',
          security: [{ bearerAuth: [] }],
          description: 'Create a new meterReading with the provided information',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/meterReading',
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Meter reading created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        $ref: '#/components/schemas/meterReading',
                      },
                    },
                  },
                },
              },
            },
            '400': {
              description: 'Invalid input',
            },
          },
        },
    },
    'meterReading/{id}': {
        get: {
            tags: ['MeterReading'],
            summary: 'Get meter reading by id',
            security: [{bearerAuth: []}],
            description: 'Retrieve a meter reading by their unique id',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid'
                    },
                    description: 'The unique id of meter reading',
                },
            ],
            responses: {
                '200': {
                    description: 'Meter reading found succefully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        $ref: '#/components/schemas/meterReading',
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Meter reading not found',
                },
            },
        },
        patch: {
            tags: ['MeterReading'],
            summary: 'Update meter reading by id',
            security: [{ bearerAuth: []}],
            description: 'Update meter reading information',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid'
                    },
                    description: 'The unique identifier of the meter reading',
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schema/UpdatemeterReading'
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Meter reading update',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        $ref: '#/components/schema/meterReading',
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description:'Meter reading not found',
                },
            },
        },

        delete: {
            tags: ['MeterReading'],
            summary: 'Delete meter reading by id',
            security: [{ bearerAuth: []}],
            description: 'Delete meter reading by id',
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: {
                        type: 'string',
                        format: 'uuid',
                    },
                    description: 'The unique identifier of meter reading',
                },
            ],
            responses: {
                '200': {
                    description: 'Meter reading deleted succefully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    data: {
                                        $ref: '#/components/schema/meterReading'
                                    },
                                },
                            },
                        },
                    },
                },
                '404': {
                    description: 'Meter reading not found',
                },
            },
        },
    },
};

export { meterReadingPath, meterReadingTags, meterReadingSchema };