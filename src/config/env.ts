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

const env: EnvConfig = {
  PORT: getEnvVarNumber("PORT"),
  NODE_ENV: getEnvVar("NODE_ENV", "development") as
    | "development"
    | "production"
    | "test",
  DB_HOST: getEnvVar("DB_HOST", "localhost"),
  DB_PORT: getEnvVarNumber("DB_PORT"),
  DB_USER: getEnvVar("DB_USER", "root"),
  DB_PASSWORD: getEnvVar("DB_PASSWORD", ""),
  DB_NAME: getEnvVar("DB_NAME", "test"),
};

export default env;
