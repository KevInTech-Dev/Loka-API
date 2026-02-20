import { Options } from "sequelize";
import env from "./env";

const options: Options = {
  host: env.DB_HOST,
  port: env.DB_PORT,

  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging:
    env.NODE_ENV === "development"
      ? (msg) => {
          console.log(`[SQL ]- ${new Date().toISOString()}  ${msg}`);
        }
      : false,
  dialect: "postgres",
};

export default options;
