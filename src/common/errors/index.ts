/**
 * Custom Error Classes
 * Structured error handling for the application
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    isOperational = true,
    details?: unknown,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);

    // Set prototype explicitly for TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation Error (422)
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 422, true, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, "UNAUTHORIZED", 401, true);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, "FORBIDDEN", 403, true);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, "NOT_FOUND", 404, true);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class CheckExistence extends NotFoundError {
  static of<T>(
    entity: T | null | undefined,
    resourceName: string,
    identifier?: string
  ): T {
    if (!entity) {
      throw new NotFoundError(resourceName, identifier);
    }
    return entity;
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409, true);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "BAD_REQUEST", 400, true, details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends AppError {
  constructor(message = "Internal server error") {
    super(message, "INTERNAL_SERVER_ERROR", 500, false);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Service Unavailable Error (503)
 */
export class ServiceUnavailableError extends AppError {
  constructor(service: string) {
    super(
      `${service} is currently unavailable`,
      "SERVICE_UNAVAILABLE",
      503,
      true,
    );
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}

/**
 * Database Error
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DATABASE_ERROR", 500, false, details);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Authentication Error
 */
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401, true);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Token Expired Error
 */
export class TokenExpiredError extends AppError {
  constructor(message = "Token has expired") {
    super(message, "TOKEN_EXPIRED", 401, true);
    Object.setPrototypeOf(this, TokenExpiredError.prototype);
  }
}

/**
 * Rate Limit Error (429)
 */
export class RateLimitError extends AppError {
  constructor(message = "Too many requests, please try again later") {
    super(message, "RATE_LIMIT_EXCEEDED", 429, true);
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Ownership Error (IDOR Protection)
 */
export class OwnershipError extends AppError {
  constructor(resource: string = "Resource") {
    super(
      `You do not have permission to access this ${resource.toLowerCase()}`,
      "OWNERSHIP_VIOLATION",
      403,
      true,
    );
    Object.setPrototypeOf(this, OwnershipError.prototype);
  }
}

/**
 * Duplicate Entry Error (409)
 * Used when trying to create a resource that already exists (e.g., duplicate email)
 */
export class DuplicateEntryError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "DUPLICATE_ENTRY", 409, true, details);
    Object.setPrototypeOf(this, DuplicateEntryError.prototype);
  }
}

export default {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  CheckExistence,
  InternalServerError,
  ServiceUnavailableError,
  DatabaseError,
  AuthenticationError,
  TokenExpiredError,
  RateLimitError,
  OwnershipError,
  DuplicateEntryError,
};
