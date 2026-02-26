import { z } from 'zod';

const defaultPaginationQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().nullish(),
    sortBy: z.string().nullish(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export {
    defaultPaginationQuery,
}