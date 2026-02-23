import { BaseTypes } from "@/common/models/base.model";
import { RoleEnum } from "@/enums/RoleEnum";

export type UserResponse = BaseTypes & {
  username: string;
  firstname?: string;
  lastname?: string;
  role: RoleEnum;
  email: string;
  isActive: boolean;
  profilePhotoUrl?: string;
  isEmailVerified: boolean;
};
