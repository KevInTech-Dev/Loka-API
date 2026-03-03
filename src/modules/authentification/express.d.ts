import { Request } from 'express';
import { User } from '@modules/models/user.model';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export { };
