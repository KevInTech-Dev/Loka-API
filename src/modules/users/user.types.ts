import { BaseTypes } from "@/common/models/base.model";
import { RoleEnum } from "@/enums/RoleEnum";
import {UserAttributes} from "@database/models/Users";

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



export type WhereQueryUser = {
  [key in keyof UserAttributes]?: string | number | boolean;
};