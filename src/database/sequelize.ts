import options from "@/config/database";
import env from "@/config/env";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  ...options,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();

    console.log("Connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

const syncDatabase = async () => {
  if (env.NODE_ENV === "production") {
    console.warn(
      "Database synchronization is disabled in production environment.",
    );
    return;
  }

  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to synchronize the database:", error);
  }
};

const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log("Database connection closed successfully.");
  } catch (error) {
    console.error("Unable to close the database connection:", error);
  }
};

export { sequelize, testConnection, syncDatabase, closeConnection };
