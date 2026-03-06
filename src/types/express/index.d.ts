import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                role: string;
                username: string,
                firstname: string,
                lastname: string,
                phoneNumber: string,
                email: string,
            };
            customField?: string;
        }
    }
}
