import { sendForbidden } from '@/common/api.response';
import { NextFunction, Request, Response } from 'express';
export const authorize = (allowRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !allowRoles.includes(req.user.role)) {
            return sendForbidden(res, "you not have role allowed")
        }
        next()
    }
}