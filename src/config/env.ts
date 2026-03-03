import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_DIALECT: "postgres" | "mysql" | "sqlite" | "mariadb" | "mssql";
  DB_LOGGING: boolean;
  JWT_SECRET: string;
  REFRESH_TOKEN: string;
  ACCESS_TOKEN_EXPRIRY_TIME: number;


  API_PREFIX?: string;

  // File upload settings
  MAX_FILE_SIZE: number;
  UPLOAD_DIR: string;


  // bcrypt settings
  BCRYPT_SALT_ROUNDS: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

const getEnvVarNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key] || defaultValue?.toString();
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  const numValue = Number(value);
  if (isNaN(numValue)) {
    throw new Error(`Environment variable ${key} is not a valid number`);
  }
  return numValue;
};

export const env: EnvConfig = {

  //General
  NODE_ENV: getEnvVar("NODE_ENV", "development") as
    | "development"
    | "production"
    | "test",

  //Database
  DB_HOST: getEnvVar("DB_HOST", "localhost"),
  DB_PORT: getEnvVarNumber("DB_PORT"),
  DB_USER: getEnvVar("DB_USER", "root"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD", ""),
  DB_NAME: getEnvVar("DB_NAME", "test"),
  DB_DIALECT: getEnvVar("DB_DIALECT", "postgres") as
    | "postgres"
    | "mysql"
    | "sqlite"
    | "mariadb"
    | "mssql",
  DB_LOGGING: getEnvVar("DB_LOGGING", "false").toLowerCase() === "true",
  //API
  PORT: getEnvVarNumber("PORT"),
  API_PREFIX: getEnvVar("API_PREFIX", "/api"),

  //File upload
  MAX_FILE_SIZE: getEnvVarNumber("MAX_FILE_SIZE", 5242880), // 5MB default
  UPLOAD_DIR: getEnvVar("UPLOAD_DIR", "uploads"),

  //bcrypt
  BCRYPT_SALT_ROUNDS: getEnvVarNumber("BCRYPT_SALT_ROUNDS", 10),

  //JWT
  JWT_SECRET: getEnvVar("JWT_SECRET"),

  //Refresh token
  REFRESH_TOKEN: getEnvVar("REFRESH_TOKEN"),

  //Access token expiry time
  ACCESS_TOKEN_EXPRIRY_TIME: getEnvVarNumber("ACCESS_TOKEN_EXPRIRY_TIME"),

};

export default env;
