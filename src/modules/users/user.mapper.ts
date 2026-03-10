import {User} from "@database/models/Users";
import {UserResponse} from "@modules/users/user.types";
import {CreateUserInput} from "@modules/users/user.schema";
import {BaseMapper} from "@common/mapper/base.mapper";
import {RoleEnum} from "@/enums/RoleEnum";

export class UserMapper implements BaseMapper<User, UserResponse> {
    toResponse(user: User): UserResponse {
        return {
            id: user?.id || '',
            username: user?.username || '',
            firstname: user?.firstname || '',
            lastname: user?.lastname || '',
            phoneNumber: user?.phoneNumber || '',
            role: user?.role || RoleEnum.LOCATAIRE,
            email: user?.email || '',
            isActive: user?.isActive || false,
            profilePhotoUrl: user?.profilePhotoUrl || '',
            isEmailVerified: user?.isEmailVerified || false,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
        }
    }

    toEntity(data: CreateUserInput): Partial<User> {
        return {
            email: data?.email,
            username: data?.username,
            role: data?.role,
            phoneNumber: data?.phoneNumber,
            password: data.password,
            isEmailVerified: false,
            isActive: false,
            firstname: data?.firstname,
            lastname: data?.lastname,
            profilePhotoUrl: data?.photo,
        }
    }
}