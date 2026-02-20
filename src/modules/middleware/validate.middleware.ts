/**
 * Validation Middleware - Centralized Zod validation
 */
import {NextFunction, Request, Response} from 'express';
import {ZodError, ZodType, ZodTypeAny} from 'zod';
import {sendValidationError} from "@common/api.response";

export interface ValidationSchemas {
    body?: ZodTypeAny;
    params?: ZodTypeAny;
    query?: ZodTypeAny;
}

type Location = 'body' | 'params' | 'query';

/**
 * Validate request. Accepts:
 * - (schemas: ValidationSchemas)  e.g. validate({ body: z.object({...}), params: z.object({...}) })
 * - (schema: ZodTypeAny, location?: Location)  e.g. validate(mySchema, 'body') or validate(mySchema, 'query')
 * - (schema: ZodTypeAny)  - a raw Zod z.object({ body: ..., params: ... }) shape
 */
export const validate = (schemas: ValidationSchemas | ZodTypeAny, location?: Location) => {

    if (schemas instanceof ZodType && location === undefined) {
        throw Error(`Invalid location: ${JSON.stringify(location)}`);
    }

    if (!(schemas instanceof ZodType) && location !== undefined) {
        throw Error(`Location should only be provided when using a single Zod schema. Received location: ${JSON.stringify(location)}`);
    }

    return async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
        try {
            const errors: { field: string; message: string }[] = [];

            // Case 1: Single schema with explicit location, e.g. validate(schema, 'query')
            if (location) {
                const result = (schemas as ZodTypeAny).safeParse(req[location]);
                if (!result.success) {
                    errors.push(...formatZodErrors(result.error, location));
                } else {
                    (req as any)[location] = result.data;
                }
                if (errors.length > 0) return sendValidationError(res, 'Validation failed', errors);
                return next();
            }

            // Case 2: Check if it's a raw Zod schema (has _def.typeName)
            const isRawZod = typeof (schemas as any)?._def?.typeName === 'string';

            if (isRawZod) {
                // It could be a z.object({ body: ..., params: ... }) or just a plain schema
                const shape = (schemas as any)?._def?.shape?.();
                const hasLocationKeys = shape && Object.keys(shape).some((k: string) => ['body', 'params', 'query'].includes(k));

                if (hasLocationKeys) {
                    const result = (schemas as ZodTypeAny).safeParse({
                        body: req.body,
                        params: req.params,
                        query: req.query
                    });
                    if (!result.success) {
                        return sendValidationError(res, 'Validation failed', formatZodErrors(result.error, ''));
                    }
                    const data = result.data as any;
                    if (data.body) req.body = data.body;
                    if (data.params) req.params = data.params;
                    if (data.query) req.query = data.query;
                    return next();
                } else {
                    // Single schema, default apply to body
                    const result = (schemas as ZodTypeAny).safeParse(req.body);
                    if (!result.success) {
                        errors.push(...formatZodErrors(result.error, 'body'));
                    } else {
                        req.body = result.data;
                    }
                    if (errors.length > 0) return sendValidationError(res, 'Validation failed', errors);
                    return next();
                }
            }

            // Case 3: Standard ValidationSchemas object
            const vs = schemas as ValidationSchemas;
            if (vs.body) {
                const result = vs.body.safeParse(req.body);
                if (!result.success) errors.push(...formatZodErrors(result.error, 'body'));
                else req.body = result.data;
            }
            if (vs.params) {
                const result = vs.params.safeParse(req.params);
                if (!result.success) errors.push(...formatZodErrors(result.error, 'params'));
                else req.params = result.data as Record<string, string>;
            }
            if (vs.query) {
                const result = vs.query.safeParse(req.query);
                if (!result.success) errors.push(...formatZodErrors(result.error, 'query'));
                else req.query = result.data as Record<string, string>;
            }

            if (errors.length > 0) return sendValidationError(res, 'Validation failed', errors);
            next();
        } catch (error) {
            return sendValidationError(res, 'Validation error occurred');
        }
    };
};

const formatZodErrors = (error: ZodError, location: string): { field: string; message: string }[] => {
    return error.issues.map((err) => ({
        field: location ? `${location}.${err.path.join('.')}` : err.path.join('.'),
        message: err.message,
    }));
};

export default validate;
