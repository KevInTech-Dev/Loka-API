/**
 * File Upload Middleware
 * Handles multipart/form-data file uploads using Multer
 */
import { Request, RequestHandler } from "express";

import multer, { FileFilterCallback } from "multer";
import path from "node:path";
import fs from "node:fs";

import { AppError } from "@/common/errors";
import { env } from "@/config/env";

// Ensure upload directory exists
const uploadDir = env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

type FileType = "image" | "document";

type FieldConfig = {
  name: string; // form field name
  maxCount?: number; // for multiple files in the same field
};

type UploadOptions = {
  fieldName?: string; // form field name, default 'file'
  subFolder?: string;
  fileType?: FileType;
  maxFileSize?: number; // in bytes
  maxFiles?: number; // for multiple uploads
  fields?: FieldConfig[];
};

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<FileType, string[]> = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ],
};

// File size limits (in bytes)
const MAX_FILE_SIZE = env.MAX_FILE_SIZE || 5242880; // 5MB default

// Configure storage
const storage = (fileSubFolder: string = "general") => {
  return multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const dest = path.join(uploadDir, fileSubFolder);
      // Ensure subfolder exists
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      cb(null, dest);
    },
    filename: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(_file.originalname);
      const baseName = path
        .basename(_file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, "_");
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });
};

// File filter function
const fileFilter =
  (filetype: FileType = "image") =>
  (_req: Request, _file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = ALLOWED_MIME_TYPES[filetype];
    if ((allowed as readonly string[]).includes(_file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          `File type ${_file.mimetype} is not allowed. Allowed types: ${allowed.join(", ")}`,
          "UNSUPPORTED_MEDIA_TYPE",
          415,
        ),
      );
    }
  };

// Create multer instance
const BuildMulter = ({
  subFolder,
  fileType = "image",
  maxFileSize = MAX_FILE_SIZE,
  maxFiles = 1,
}: Omit<UploadOptions, "fieldName">) =>
  multer({
    storage: storage(subFolder),
    limits: {
      fileSize: maxFileSize,
      files: maxFiles,
    },
    fileFilter: fileFilter(fileType),
  });

// Export configured middleware

/**
 * Middleware pour un seul fichier.
 * @example router.post('/avatar', singleUpload({ fileType: 'image' }), handler)
 */
export const singleUpload = ({
  fieldName = "file",
  ...rest
}: UploadOptions = {}): RequestHandler =>
  BuildMulter({ ...rest, maxFiles: 1 }).single(fieldName);

/**
 * Middleware pour plusieurs fichiers.
 * @example router.post('/docs', multipleUpload({ fileType: 'document', maxFiles: 3 }), handler)
 */
export const multipleUpload = ({
  fieldName = "file",
  maxFiles = 5,
  ...rest
}: UploadOptions = {}): RequestHandler =>
  BuildMulter({ ...rest, maxFiles }).array(fieldName, maxFiles);

/**
 * Middleware pour plusieurs champs avec des fieldnames différents.
 * @example
 * router.post('/profile', fieldsUpload({
 *   fields: [
 *     { name: 'avatar', maxCount: 1 },
 *     { name: 'documents', maxCount: 3 },
 *     { name: 'gallery', maxCount: 5 },
 *   ]
 * }), handler)
 */
export const fieldsUpload = ({
  fields = [],
  ...rest
}: UploadOptions = {}): RequestHandler =>
  BuildMulter({
    ...rest,
    maxFiles: fields.reduce((acc, f) => acc + (f.maxCount ?? 1), 0),
  }).fields(fields);

// Helper to get file URL
export const getFileUrl = (req: Request, filePath: string): string => {
  const relativePath = filePath.replace(/^uploads\//, "");
  return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
};

// Export file type constants for use elsewhere
export const ALLOWED_FILE_TYPES = ALLOWED_MIME_TYPES;
export const DEFAULT_MAX_UPLOAD_SIZE = MAX_FILE_SIZE;
