/**
 * File Upload Middleware
 * Handles multipart/form-data file uploads using Multer
 */
import {Request, RequestHandler} from "express";

import multer, {FileFilterCallback} from "multer";
import path from "path";
import fs from "fs";

import {AppError} from "@/common/errors";
import {env} from "@/config/env";

// Ensure upload directory exists
const uploadDir = env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

type FileType = 'image' | 'document';

type UploadOptions = {
    fieldName?: string; // form field name, default 'file'
    subFolder?: string;
    fileType?: FileType;
    maxFileSize?: number; // in bytes
    maxFiles?: number; // for multiple uploads
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
const storage = (fileSubFolder: string = 'general') => {
    return multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, destination: string) => void,
        ) => {
            // Create subdirectory based on entity type if provided

            const subDir = path.join(uploadDir, fileSubFolder);

            if (!fs.existsSync(subDir)) {
                fs.mkdirSync(subDir, {recursive: true});
            }

            cb(null, subDir);
        },
        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: (error: Error | null, filename: string) => void,
        ) => {
            // Generate unique filename
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            const ext = path.extname(file.originalname);
            const baseName = path
                .basename(file.originalname, ext)
                .replace(/[^a-zA-Z0-9]/g, "_");
            cb(null, `${baseName}-${uniqueSuffix}${ext}`);
        },
    });
}

// File filter function
const fileFilter = (filetype: FileType = 'image') => (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    if (ALLOWED_MIME_TYPES[filetype].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `File type ${file.mimetype} is not allowed. Allowed types: ${ALLOWED_MIME_TYPES[filetype].join(", ")}`,
                "UNSUPPORTED_MEDIA_TYPE",
                415,
            ),
        );
    }
};

// Create multer instance
export const upload = (options?: Omit<UploadOptions,'fieldName'| 'maxFiles'>) => multer({
    storage: storage(options?.subFolder),
    limits: {
        fileSize: options?.maxFileSize || MAX_FILE_SIZE,
        files: 1,
    },
    fileFilter: fileFilter(options?.fileType),
});

// Multi-file upload configuration

export const uploadMultiple = (option?: Omit<UploadOptions, 'fieldName'>) => multer({
    storage: storage(option?.subFolder),
    limits: {
        fileSize: option?.maxFileSize || MAX_FILE_SIZE,
        files: option?.maxFiles || 5,
    },
    fileFilter: fileFilter(option.fileType),
});

// Export configured middleware
export const singleUpload =
    ({fieldName='file', ...rest}:UploadOptions): RequestHandler => upload(rest).single(fieldName);
export const multipleUpload =
    ({fieldName = 'file', maxFiles = 5,...rest}:UploadOptions): RequestHandler => uploadMultiple(rest).array(fieldName, maxFiles);

// Helper to get file URL
export const getFileUrl = (req: Request, filePath: string): string => {
    const relativePath = filePath.replace(/^uploads\//, "");
    return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
};


// Export file type constants for use elsewhere
export const ALLOWED_FILE_TYPES = ALLOWED_MIME_TYPES;
export const DEFAULT_MAX_UPLOAD_SIZE = MAX_FILE_SIZE;
