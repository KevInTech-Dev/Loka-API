import fs from "fs";
import {join} from "path";

export const deleteFile = (filePath: string): void => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

export const fileExists = (filePath: string): boolean => {
    const path = join(process.cwd(), filePath);
    return fs.existsSync(path);
}