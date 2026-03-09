import {CreateUserInput} from "@modules/users/user.schema";
import {UserRepository} from "@modules/users/user.repository";

import {hashWord} from "@utils/password.utils";
import {UserResponse} from "./user.types";
import {NotFoundError} from "@/common/errors";
import {deleteFile, fileExists} from "@/utils/file.utils";
import {UserMapper} from "@modules/users/user.mapper";

export class UserService {
    private userRepository: UserRepository;
    private userMapper: UserMapper;

    constructor() {
        this.userRepository = new UserRepository();
        this.userMapper = new UserMapper();
    }

    async createUser(data: CreateUserInput): Promise<UserResponse | null> {

        const haspass = await hashWord(data.password);

        const user = await this.userRepository.create(this.userMapper.toEntity({...data, password: haspass}));

        console.log("nothing");

        return this.userMapper.toResponse(user);
    }


    async addPhoto(id: string, file: Express.Multer.File) {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User");
        }

        try {
            if (user.profilePhotoUrl && user.profilePhotoUrl.length > 0) {
                if (fileExists(user.profilePhotoUrl)) {
                    deleteFile(user.profilePhotoUrl)
                }
            }
        } catch (error) {
            console.error(error);
        }


        const updatedUser = await this.userRepository.update(id, {
            profilePhotoUrl: file.path,
        });


        if (!updatedUser) {
            throw new NotFoundError("User");
        }

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            role: updatedUser.role,
            email: updatedUser.email,
            isActive: updatedUser.isActive,
            profilePhotoUrl: updatedUser.profilePhotoUrl,
            isEmailVerified: updatedUser.isEmailVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }

    async getUserById(id: string): Promise<UserResponse | null> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            phoneNumber: user.phoneNumber,
            email: user.email,
            isActive: user.isActive,
            profilePhotoUrl: user.profilePhotoUrl,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async getUserPaginated(page: number, limit: number): Promise<UserResponse[]> {
        return (await this.userRepository.getUserPaginated(page, limit)).map(
            (user) => {
                return {
                    id: user.id,
                    username: user.username,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    email: user.email,
                    isActive: user.isActive,
                    profilePhotoUrl: user.profilePhotoUrl,
                    isEmailVerified: user.isEmailVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            },
        );
    }

    async updateUser(
        id: string,
        data: Partial<CreateUserInput>,
    ): Promise<UserResponse | null> {
        const updatedUser = await this.userRepository.update(id, data);
        if (!updatedUser) {
            return null;
        }
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            firstname: updatedUser.firstname,
            lastname: updatedUser.lastname,
            role: updatedUser.role,
            email: updatedUser.email,
            isActive: updatedUser.isActive,
            phoneNumber: updatedUser.phoneNumber,
            profilePhotoUrl: updatedUser.profilePhotoUrl,
            isEmailVerified: updatedUser.isEmailVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }

    async deleteUser(id: string): Promise<boolean> {
        const deleted = await this.userRepository.softDelete(id);
        if (!deleted) {
            throw new Error("User not found");
        }
        return true;
    }

}

