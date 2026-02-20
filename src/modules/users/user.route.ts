import {Router} from "express";
import {UserController} from "@modules/users/user.controller";


const router: Router = Router();
const userController = new UserController();

// get all users
router.get('', userController.getAllUsers);


// get user by id
router.get('/:id', userController.getUser);

// update user by id
router.patch('', userController.updateUser);

// create user
router.post('', userController.createUser);

// delete user by id
router.delete('/:id', userController.deleteUser);

export default router;