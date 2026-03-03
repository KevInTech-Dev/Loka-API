import { User } from '@/database/models/Users';
import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '@modules/users/user.repository'
import { JwtPayload } from 'jsonwebtoken';
import env from '@/config/env';

// Étend la requête Express pour inclure l'utilisateur authentifié
interface RequestWithUser extends Request {
    user: User;
}

const userRepository = new UserRepository();
const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        // Récupérer le token de l'en-tête Authorization
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Authentification échouée: token manquant.');
        }

        // Vérifier le token
        const secretKey: jwt.Secret = env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        // Trouver l'utilisateur dans la base de données
        const user = await userRepository.findById(decoded.userId); // userId est l'ID stocké dans le payload du token

        if (!user) {
            throw new Error('Authentification échouée: utilisateur non trouvé.');
        }

        // Attacher l'utilisateur à l'objet Request pour les prochaines middlewares/routes
        req.user = user;

        next();
    } catch (error) {
        res.status(401).send({ error: 'Veuillez vous authentifier.' });
    }
};

export default authMiddleware;
