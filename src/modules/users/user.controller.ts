import {Request, Response} from "express";

export class UserController {

    getAllUsers(req: Request, res: Response) {
        return res.send('user found');
    }

    getUser(req: Request, res: Response) {
        return res.send('user found');
    }

    updateUser(req: Request, res: Response) {
        return res.send('user updated');
    }

    createUser(req: Request, res: Response) {
        console.log(req.body)
        return res.send('user created');
    }

    deleteUser(req: Request, res: Response) {
        console.log(req.params)
        return res.send('user deleted');
    }

}