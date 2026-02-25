import {Request, Response} from "express";
import {UserService} from "@modules/users/user.service";
import {CreateUserInput} from "@modules/users/user.schema";

export class UserController {
    private readonly userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAllUsers = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        return res.send({
            page: req.query.page,
            limit: req.query.limit,
            data: await this.userService.getUserPaginated(page, limit),
        });
    };

    getUser = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        return res.send({
            data: await this.userService.getUserById(id),
        });
    };

    updateUser = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const data = req.body as CreateUserInput;

        return res.send({
            data: await this.userService.updateUser(id, data),
        });
    };

    addPhoto = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const file = req.file;

        if (!file) {
            return res.status(400).json({error: "No file uploaded"});
        }

        return res.send({
            data: await this.userService.addPhoto(id, file),
        });
    };

    createUser = async (req: Request, res: Response) => {
        const data: CreateUserInput = {...req.body, photo: req.file.path, role: "admin"};
        return res.send({
            data: await this.userService.createUser(data),
        });
    };

    deleteUser = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        return res.send({
            data: await this.userService.deleteUser(id),
        });
    };
}
