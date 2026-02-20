import {Router} from "express";
import {UserController} from "@modules/users/user.controller";
import validate from "@modules/middleware/validate.middleware";
import {createUserSchema, userIdShema} from "@modules/users/user.schema";
import {defaultPaginationQuery} from "@common/api.schema";


const router: Router = Router();
const userController = new UserController();

// get all users
router.get('', validate(defaultPaginationQuery, 'query'), userController.getAllUsers);

// create user
router.post('', validate(createUserSchema, 'body'), userController.createUser);

// get user by id
router.get('/:id', userController.getUser);

// update user by id
router.patch('/:id', validate({
    params: userIdShema,
    body: createUserSchema
}), userController.updateUser);

// delete user by id
router.delete('/:id', validate(userIdShema, 'params'), userController.deleteUser);

export default router;