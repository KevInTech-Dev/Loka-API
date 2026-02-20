import {Request, Response} from "express";
import {UserService} from "@modules/users/user.service";
import {CreateUserInput} from "@modules/users/user.schema";

export class UserController {

    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers(req: Request, res: Response) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: this.userService.getUserPaginated(page, limit)
        });
    }

    getUser(req: Request, res: Response) {

        const id = req.params.id as string;

        return res.send({
            data: this.userService.getUserById(id),
        });
    }

    updateUser(req: Request, res: Response) {

        const id = req.params.id as string;
        const data = req.body as CreateUserInput;

        return res.send({
            data: this.userService.updateUser(id, data),
        });
    }

    createUser(req: Request, res: Response) {
        const data: CreateUserInput = req.body;
        return res.send({
            data: this.userService.createUser(data),
        });
    }

    deleteUser(req: Request, res: Response) {
        const id = req.params.id as string;
        return res.send({
            data: this.userService.deleteUser(id),
        });
    }

}