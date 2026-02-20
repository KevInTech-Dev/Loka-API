import {CreateUserInput} from "@modules/users/user.schema";
import {UserRepository} from "@modules/users/user.repository";
import {RoleEnum} from "@/enums/RoleEnum";

export class UserService {

    private userRepository: UserRepository;

    constructor(

    ) {
        this.userRepository = new UserRepository();
    }

    async createUser(data: CreateUserInput) {
        const existingUser = this.userRepository.getUserByEmail(data.email);

        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        return (await this.userRepository.createUser({
            email: data.email,
            username: data.username,
            password: data.password,
            role: RoleEnum.ADMIN,
            isEmailVerified: false,
            isActive: false,
        }));

    }

    async getUserById(id: string) {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    async getUserPaginated(page: number, limit: number) {
        return this.userRepository.getUserPaginated(page, limit);
    }

    async updateUser(id: string, data: Partial<CreateUserInput>) {
        const updatedUser = await this.userRepository.updateUser(id, data);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }

    async deleteUser(id: string) {
        const deleted = await this.userRepository.deleteUser(id);
        if (!deleted) {
            throw new Error('User not found');
        }
        return true;
    }

}