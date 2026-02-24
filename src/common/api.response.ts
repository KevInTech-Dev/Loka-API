
/**
 * Standardized API Response
 */
import { Response } from 'express';

export interface ApiResponseType<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: { code: string; message: string; details?: unknown; };
    meta?: { [key: string]: unknown; };
}

export interface PaginationMeta {
    [key: string]: unknown;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export const sendSuccess = <T>(
    res: Response, data: T, message = 'Operation successful',
    statusCode: number = 200, meta?: PaginationMeta | Record<string, unknown>
): Response => {
    const response: ApiResponseType<T> = { success: true, data, message };
    if (meta) response.meta = meta;
    return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = 'Resource created successfully'): Response => {
    return sendSuccess(res, data, message, 201);
};

export const sendPaginated = <T>(
    res: Response, data: T[], page: number, limit: number, total: number, message = 'Data retrieved successfully'
): Response => {
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = { page, limit, total, totalPages };
    return sendSuccess(res, data, message, 200, meta);
};

export const sendNoContent = (res: Response): Response => res.status(204).send();

/**
 * Send an error response.
 * Overloads:
 * - sendError(res, message, statusCode) — shorthand, auto-generates code
 * - sendError(res, code, message, statusCode, details) — full form
 */
export function sendError(res: Response, message: string, statusCode?: number): Response;
export function sendError(res: Response, code: string, message: string, statusCode?: number, details?: unknown): Response;
export function sendError(res: Response, codeOrMessage: string, messageOrStatus?: string | number, statusCodeOrDetails?: number | unknown, details?: unknown): Response {
    let code: string, message: string, statusCode: number;

    if (typeof messageOrStatus === 'number' || messageOrStatus === undefined) {
        // Short form: sendError(res, 'message', 401)
        message = codeOrMessage;
        statusCode = (messageOrStatus as number) || 400;
        code = statusCode === 401 ? 'UNAUTHORIZED' : statusCode === 403 ? 'FORBIDDEN' : statusCode === 404 ? 'NOT_FOUND' : statusCode === 409 ? 'CONFLICT' : statusCode === 422 ? 'VALIDATION_ERROR' : 'ERROR';
    } else {
        // Full form: sendError(res, 'CODE', 'message', 400, details)
        code = codeOrMessage;
        message = messageOrStatus as string;
        statusCode = (statusCodeOrDetails as number) || 400;
    }

    return res.status(statusCode).json({ success: false, error: { code, message, details } });
}

export const sendValidationError = (res: Response, message = 'Validation failed', details?: unknown): Response => sendError(res, 'VALIDATION_ERROR', message, 422, details);
export const sendUnauthorized = (res: Response, message = 'Unauthorized access'): Response => sendError(res, 'UNAUTHORIZED', message, 401);
export const sendForbidden = (res: Response, message = 'Access denied'): Response => sendError(res, 'FORBIDDEN', message, 403);
export const sendNotFound = (res: Response, message = 'Resource not found'): Response => sendError(res, 'NOT_FOUND', message, 404);
export const sendConflict = (res: Response, message = 'Resource already exists'): Response => sendError(res, 'CONFLICT', message, 409);
export const sendServerError = (res: Response, message = 'Internal server error'): Response => sendError(res, 'INTERNAL_SERVER_ERROR', message, 500);
