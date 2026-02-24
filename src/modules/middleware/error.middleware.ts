/**
 * Error Handling Middleware
 * Global error handler for the application
 */

import { Request, Response, NextFunction } from "express";
import {
  QueryError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
  ForeignKeyConstraintError,
} from "sequelize";
import {
  AppError,
  ValidationError,
  DatabaseError,
  DuplicateEntryError,
} from "@/common/errors";
import { sendError, sendServerError } from "@/common/api.response";
import { env } from "@/config/env";

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  // Log error for debugging
  console.error(`[Error] ${new Date().toISOString()}`);
  console.error("Path:", req.path);
  console.error("Method:", req.method);
  console.error("Error:", error.message);

  if (env.NODE_ENV === "development") {
    console.error("Stack:", error.stack);
  }

  // Handle known application errors
  if (error instanceof AppError) {
    return sendError(
      res,
      error.code,
      error.message,
      error.statusCode,
      error.details,
    );
  }

  // Handle Sequelize errors
  if (error instanceof UniqueConstraintError) {
    const field = error.errors[0]?.path || "field";
    return sendError(res, "CONFLICT", `Duplicate value for ${field}`, 409);
  }

  if (error instanceof SequelizeValidationError) {
    const messages = error.errors.map((e) => e.message);
    return sendError(
      res,
      "VALIDATION_ERROR",
      "Validation failed",
      422,
      messages,
    );
  }

  if (error instanceof ForeignKeyConstraintError) {
    return sendError(
      res,
      "FOREIGN_KEY_ERROR",
      "Invalid reference to related resource",
      400,
    );
  }

  if (error instanceof QueryError) {
    return sendError(res, "DATABASE_ERROR", "Database query error", 500);
  }

  // Handle validation errors from our custom class
  if (error instanceof ValidationError) {
    return sendError(
      res,
      error.code,
      error.message,
      error.statusCode,
      error.details,
    );
  }

  // Handle database errors
  if (error instanceof DatabaseError) {
    return sendError(res, error.code, error.message, error.statusCode);
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && "body" in error) {
    return sendError(res, "INVALID_JSON", "Invalid JSON in request body", 400);
  }

  // Handle duplicate entry errors
  if (error instanceof DuplicateEntryError) {
    return sendError(res, error.code, error.message, error.statusCode);
  }

  // Handle unknown errors
  const message =
    env.NODE_ENV === "production" ? "Internal server error" : error.message;

  return sendServerError(res, message);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return sendError(
    res,
    "NOT_FOUND",
    `Route ${req.method} ${req.path} not found`,
    404,
  );
};

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default errorHandler;
