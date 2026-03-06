import { Router } from "express";
import { UserController } from "@modules/users/user.controller";
import validate from "@modules/middleware/validate.middleware";
import { createUserSchema, userIdShema } from "@modules/users/user.schema";
import { singleUpload } from "@modules/middleware/upload.middleware";
import { defaultPaginationQuery } from "@common/api.schema";
import authMiddleware from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorization.middleware";

const router: Router = Router();
const userController = new UserController();

// get all users
router.get("",
    authMiddleware,
    authorize(["admin", "proprietaire"]),
    validate(defaultPaginationQuery, 'query'), userController.getAllUsers);

// router.get("", userController.getAllUsers);


// create user
router.post("", authMiddleware, authorize(["admin"]), singleUpload({
    fieldName: "photo",
    fileType: 'image',
    subFolder: "profiles",
}), validate(createUserSchema, "body"), userController.createUser);

router.post("/photo/:id", validate(userIdShema, 'params'), singleUpload({
    fieldName: "photo",
    fileType: 'image',
    subFolder: "profiles",
}), userController.addPhoto);

// get user by id
router.get("/:id", authMiddleware, authorize(["admin"]), userController.getUser);

// update user by id
router.patch(
    "/:id", authMiddleware, authorize(["admin"]),
    validate({
        params: userIdShema,
        body: createUserSchema,
    }),
    userController.updateUser,
);

// delete user by id
router.delete(
    "/:id", authMiddleware, authorize(["admin"]),
    validate(userIdShema, "params"),
    userController.deleteUser,
);

export default router;
