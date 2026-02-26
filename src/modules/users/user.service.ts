import { CreateUserInput } from "@modules/users/user.schema";
import { UserRepository } from "@modules/users/user.repository";
<<<<<<< HEAD
import { RoleEnum } from "@/enums/RoleEnum";
import { UserResponse } from "./user.types";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { deleteFile, fileExists } from "@utils/file.utils";
=======
import { UserResponse } from "./user.types";
import { DuplicateEntryError, NotFoundError } from "@/common/errors";
import { deleteFile, fileExists } from "@utils/file.utils";
import { hashWord } from "@utils/password.utils";
>>>>>>> 292be6db25e05970c3d4b2657703a6b406d0216f

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<UserResponse | null> {

    const haspass = await hashWord(data.password);

    const user = await this.userRepository.createUser({
      email: data.email,
      username: data.username,
      password: haspass,
      role: data.role,
      isEmailVerified: false,
      isActive: false,
      firstname: data.firstname,
      lastname: data.lastname,
      profilePhotoUrl: data.photo,
    });

    console.log("nothing");

    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      email: user.email,
      isActive: user.isActive,
      profilePhotoUrl: user.profilePhotoUrl,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async addPhoto(id: string, file: Express.Multer.File) {
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    try {
      if (user.profilePhotoUrl && user.profilePhotoUrl.length > 0) {
        if (fileExists(user.profilePhotoUrl)) {
          deleteFile(user.profilePhotoUrl);
        }
      }
    } catch (error) {
      console.error(error);
    }

    const updatedUser = await this.userRepository.updateUser(id, {
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
    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundError("User");
    }

    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
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
    const updatedUser = await this.userRepository.updateUser(id, data);
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
      profilePhotoUrl: updatedUser.profilePhotoUrl,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

<<<<<<< HEAD
    async addPhoto(id: string, file: Express.Multer.File) {
        const user = await this.userRepository.getUserById(id);

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


        const updatedUser = await this.userRepository.updateUser(id, {
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
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
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
        const updatedUser = await this.userRepository.updateUser(id, data);
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
            profilePhotoUrl: updatedUser.profilePhotoUrl,
            isEmailVerified: updatedUser.isEmailVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }

    async deleteUser(id: string): Promise<boolean> {
        const deleted = await this.userRepository.deleteUser(id);
        if (!deleted) {
            throw new Error("User not found");
        }
        return true;
=======
  async deleteUser(id: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteUser(id);
    if (!deleted) {
      throw new Error("User not found");
>>>>>>> 292be6db25e05970c3d4b2657703a6b406d0216f
    }
    return true;
  }
}
