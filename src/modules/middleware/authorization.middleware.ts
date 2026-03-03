import { Request, Response } from 'express';
export const authorize = (allowRoles: string[]) => {
    return (req: Request, res: Response) => {
        if (!req.user || !allowRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès interdit: rôle insuffisant' });
        }
    }
}