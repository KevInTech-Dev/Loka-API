import options from "@/config/database";
import { Sequelize } from "sequelize";
import env from "@config/env";
import { initModelUser } from "../database/models/Users";
import { initModelAbonnement } from "../database/models/Abonnements";
import { initModelUtilisateur_Abonnement } from "../database/models/Utilisateur_Abonnement";
//import { initModelLandLord } from "./models/LandLord"; //  Vérifie le nom exact !

const sequelize = new Sequelize({
    ...options,
});

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(" Connection has been established successfully.");
        return true;
    } catch (error) {
        console.error(" Unable to connect to the database:", error);
        return false;
    }
};

const syncDatabase = async (force: boolean = false) => {
    if (env.NODE_ENV === "production") {
        console.warn(
            " Database synchronization is disabled in production environment.",
        );
        return;
    }

    try {
        await sequelize.sync({ force });
        console.log(" Database synchronized successfully.");
    } catch (error) {
        console.error(" Unable to synchronize the database:", error);
    }
};

const closeConnection = async () => {
    try {
        await sequelize.close();
        console.log(" Database connection closed successfully.");
    } catch (error) {
        console.error(" Unable to close the database connection:", error);
    }
};

const initModels = async () => {
    // Initialiser tous les modèles
    initModelUser(sequelize);
    initModelAbonnement(sequelize);
    initModelUtilisateur_Abonnement(sequelize);
    //initModelLandLord(sequelize); //  Vérifie le nom

    //  Utiliser sequelize.models pour les associations
    Object.values(sequelize.models).forEach((model: any) => {
        if (typeof model.associate === "function") {
            model.associate(sequelize.models);
        }
    });
    
    console.log(" All models initialized successfully");
};

// Exécuter l'initialisation
initModels().catch(error => 
    console.error(" Unable to initialize models:", error)
);

export { 
    sequelize, 
    testConnection, 
    syncDatabase, 
    closeConnection, 
    initModels 
};