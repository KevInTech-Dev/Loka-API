import {z} from 'zod';

const defaultPaginationQuery = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    search: z.string().nullish(),
    sortBy: z.string().nullish(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export {
    defaultPaginationQuery,
}