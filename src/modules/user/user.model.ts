/**
 * User Model
 * Sequelize model definition for the User entity
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../database";

// User attributes interface
export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: "admin" | "manager" | "tenant" | "owner";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attributes for creation (id is auto-generated)
export interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "phone" | "role" | "isActive"
> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone!: string | null;
  public role!: "admin" | "manager" | "tenant" | "owner";
  public isActive!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
      validate: {
        notEmpty: { msg: "Le prénom est requis" },
        len: {
          args: [2, 100],
          msg: "Le prénom doit contenir entre 2 et 100 caractères",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
      validate: {
        notEmpty: { msg: "Le nom est requis" },
        len: {
          args: [2, 100],
          msg: "Le nom doit contenir entre 2 et 100 caractères",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Email invalide" },
        notEmpty: { msg: "L'email est requis" },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "tenant", "owner"),
      allowNull: false,
      defaultValue: "tenant",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    underscored: true,
    timestamps: true,
  },
);

export default User;
