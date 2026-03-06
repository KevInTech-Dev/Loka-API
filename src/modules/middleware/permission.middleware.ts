import { AuthenticationError } from '@/common/errors';
import { Request, Response } from 'Express';
import { UserRepository } from '../users/user.repository';

const userRepository = new UserRepository;

export const permission = (allowedPermissions: string[]) => {
    return async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AuthenticationError();
        }

        // const userPermissions = await userRepository.getUserPermissions(req.user.id);

        // const hasPermission = allowedPermissions.every(permission =>
        //     userPermissions.includes(permission)
        // );

        // if (!hasPermission) {
        //     return res.status(403).json({
        //         message: "Accès interdit : permission insuffisante"
        //     });
        // }

    }
}