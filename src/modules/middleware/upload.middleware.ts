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

// Allowed MIME types
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
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

const ALL_ALLOWED_MIME_TYPES = [
    ...ALLOWED_MIME_TYPES.image,
    ...ALLOWED_MIME_TYPES.document,
];

// File size limits (in bytes)
const MAX_FILE_SIZE = env.MAX_FILE_SIZE || 5242880; // 5MB default

// Configure storage
const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) => {
        // Create subdirectory based on entity type if provided
        const entityType = req.body.entityType || "general";
        const subDir = path.join(uploadDir, entityType);

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

// File filter function
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    if (ALL_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new AppError(
                `File type ${file.mimetype} is not allowed. Allowed types: ${ALL_ALLOWED_MIME_TYPES.join(", ")}`,
                "UNSUPPORTED_MEDIA_TYPE",
                415,
            ),
        );
    }
};

// Create multer instance
export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1, // Single file upload per request
    },
    fileFilter,
});

// Multi-file upload configuration
export const uploadMultiple = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5, // Max 5 files per request
    },
    fileFilter,
});

// Export configured middleware
export const singleUpload = (fieldName: string = 'file'): RequestHandler => upload.single(fieldName);
export const multipleUpload = (fieldName: string = 'file', maxFile: number = 5): RequestHandler => uploadMultiple.array(fieldName, maxFile);

// Helper to get file URL
export const getFileUrl = (req: Request, filePath: string): string => {
    const relativePath = filePath.replace(/^uploads\//, "");
    return `${req.protocol}://${req.get("host")}/uploads/${relativePath}`;
};


// Export file type constants for use elsewhere
export const ALLOWED_FILE_TYPES = ALL_ALLOWED_MIME_TYPES;
export const MAX_UPLOAD_SIZE = MAX_FILE_SIZE;
