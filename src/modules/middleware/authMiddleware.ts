import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '@modules/users/user.repository'
import { PayLoadToken } from '@modules/authentification/auth.type';
import env from '@/config/env';
import { AuthenticationError, NotFoundError } from '@/common/errors';

const userRepository = new UserRepository();
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    // Récupérer le token de l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new AuthenticationError('Authentification échouée: token manquant.');
    }

    // Vérifier le token
    const secretKey: jwt.Secret = env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;


    // Trouver l'utilisateur dans la base de données
    const user = await userRepository.findById(decoded.userId); // userId est l'ID stocké dans le payload du token

    if (!user) {
        throw new NotFoundError('Authentification échouée: utilisateur non trouvé.');
    }

    // Attacher l'utilisateur à l'objet Request pour les prochaines middlewares/routes
    req.user = {
        userId: user.id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        username: user.username,
        permission: []

    } as PayLoadToken;
    next();

};

export default authMiddleware;
