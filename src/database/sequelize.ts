import options from "@/config/database";
import { Sequelize } from "sequelize";
import env from "@config/env"; // ou "@config" selon votre structure
import { initModelUser } from "./models/Users";
import { initModelAbonnement } from "./models/Abonnements";

import { initModelandLord } from "./models/landLord";
import { initModelProperty } from "./models/Property";
import { initModelPropertyType } from "./models/PropertyType";
import { initPropertyUnitLocation } from "./models/PropertyUnitLocation";
import { initUnitType } from "./models/UnitType";
import { initUnitLocation } from "./models/UnitLocation";
import { initModelTenant } from "./models/Tenants";
import { initRefreshToken } from "./models/RefreshToken";
import { initmodelPermissions } from "./models/Permissions";
import { initModelPermissionsAbonnement } from "./models/PermissionsAbonnement";
import { initModelUtilisateur_Abonnement } from "./models/Utilisateur_Abonnement";
import { initModelFactureMiantenance } from "./models/FacturesMaintenance";
import { initModelFactureLoyer } from "./models/FactureLoyer";
import { initModelFactureElectricite } from "./models/FactureElectricite";
import { initModelFactureEau } from "./models/FactureEau";
import { initModelFactureAbonnement } from "./models/FactureAbonnment";


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

const syncDatabase = async (force: boolean = false, alter: boolean = false) => {
  if (env.NODE_ENV === "production") {
    console.warn(
      "Database synchronization is disabled in production environment.",
    );
    return;
  }

  try {
    await sequelize.sync({ force, alter });
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
  initModelAbonnement(sequelize);
  initModelandLord(sequelize);
  initModelProperty(sequelize);
  initModelPropertyType(sequelize);
  initPropertyUnitLocation(sequelize);
  initUnitLocation(sequelize);
  initUnitType(sequelize);
  initRefreshToken(sequelize);
  initmodelPermissions(sequelize);
  initModelPermissionsAbonnement(sequelize);
  initModelUtilisateur_Abonnement(sequelize);
  initModelFactureMiantenance(sequelize);
  initModelFactureLoyer(sequelize);
  initModelFactureElectricite(sequelize);
  initModelFactureEau(sequelize);
  initModelFactureAbonnement(sequelize);
  initModelTenant(sequelize);

  // If you have more models, initialize them here and set up associations if needed before syncing the database.
  Object.values(sequelize.models).forEach((model: any) => {
    if (typeof model.associate === "function") {
      model.associate(sequelize.models);
    }
  });
};

initModels()
  .then(() => console.log("Models initialized successfully."))
  .catch((error) => console.error("Unable to initialize models:", error));

export { sequelize, testConnection, syncDatabase, closeConnection, initModels };
