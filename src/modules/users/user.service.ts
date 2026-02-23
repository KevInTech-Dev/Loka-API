import { CreateUserInput } from "@modules/users/user.schema";
import { UserRepository } from "@modules/users/user.repository";
import { RoleEnum } from "@/enums/RoleEnum";
import { UserResponse } from "./user.types";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<UserResponse | null> {
    const existingUser = await this.userRepository.getUserByEmail(data.email);

    if (existingUser) {
      return null;
    }

    const user = await this.userRepository.createUser({
      email: data.email,
      username: data.username,
      password: data.password,
      role: RoleEnum.ADMIN,
      isEmailVerified: false,
      isActive: false,
    });

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
    };
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      return null;
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

  async getAllUsers(): Promise<UserResponse[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserPaginated(page: number, limit: number): Promise<UserResponse[]> {
    return this.userRepository.getUserPaginated(page, limit);
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
  }
}
