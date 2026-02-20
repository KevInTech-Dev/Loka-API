import options from "@/config/database";
import env from "@/config/env";
import {Sequelize} from "sequelize";
import {initModelUser} from "./models/Users";
import { initModelandLord } from "./models/landLord";

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

const syncDatabase = async (force: boolean = false) => {
    if (env.NODE_ENV === "production") {
        console.warn(
            "Database synchronization is disabled in production environment.",
        );
        return;
    }

    try {
        await sequelize.sync({force});
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

const initModels = async () => {
    initModelUser(sequelize);
    initModelandLord(sequelize);


    // If you have more models, initialize them here and set up associations if needed before syncing the database.
    Object.values(sequelize).forEach((model) => {
        if (typeof model.associate === "function") {
            model.associate(sequelize.models);
        }
    })
};

initModels().then(() => console.log("Models initialized successfully.")).catch(error => console.error("Unable to initialize models:", error));

export {sequelize, testConnection, syncDatabase, closeConnection, initModels};
