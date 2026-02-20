/**
 * Database Connection
 * Sequelize instance and connection management
 */

import { Sequelize } from "sequelize";
import config from "../config/database";

const env = (process.env.NODE_ENV || "development") as keyof typeof config;
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
  },
);

/**
 * Test database connection
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    throw error;
  }
};

/**
 * Sync database models (development only)
 */
export const syncDatabase = async (force = false): Promise<void> => {
  try {
    await sequelize.sync({ force });
    console.log("✅ Database synchronized.");
  } catch (error) {
    console.error("❌ Database sync error:", error);
    throw error;
  }
};

export default sequelize;
