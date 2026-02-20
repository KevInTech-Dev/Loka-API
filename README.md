# Loka API - Setup Sequelize (PostgreSQL)

Guide complet pour configurer Sequelize avec migrations, seeds et modèles dans le projet Loka API.

---

## 1. Installation des dépendances

```bash
# Sequelize ORM + driver PostgreSQL
pnpm add sequelize pg pg-hstore

# Sequelize CLI (migrations & seeds) en dev
pnpm add -D sequelize-cli
```

---

## 2. Variables d'environnement

Créer un fichier **`.env`** à la racine du projet :

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loka_db
DB_USER=postgres
DB_PASSWORD=postgres
```

---

## 3. Configuration de Sequelize CLI (`.sequelizerc`)

Créer un fichier **`.sequelizerc`** à la racine pour indiquer à `sequelize-cli` où trouver les fichiers :

```js
const path = require("path");

module.exports = {
  config: path.resolve("src", "config", "database.js"),
  "models-path": path.resolve("src", "database", "models"),
  "seeders-path": path.resolve("src", "database", "seeders"),
  "migrations-path": path.resolve("src", "database", "migrations"),
};
```

> **Note :** `sequelize-cli` fonctionne en CommonJS, c'est pourquoi le fichier config de la DB a aussi une version `.js`.

---

## 4. Configuration de connexion à la base de données

### 4.1 Fichier TypeScript — `src/config/database.ts`

Utilisé par l'application au runtime :

```ts
import dotenv from "dotenv";
dotenv.config();

interface DBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: "postgres";
  logging: boolean | ((sql: string) => void);
  define: {
    timestamps: boolean;
    underscored: boolean;
  };
}

interface Config {
  development: DBConfig;
  test: DBConfig;
  production: DBConfig;
}

const config: Config = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: console.log,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db_test",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
};

export default config;

// Export CommonJS pour sequelize-cli
module.exports = config;
```

### 4.2 Fichier CommonJS — `src/config/database.js`

Utilisé par `sequelize-cli` pour les migrations et seeds :

```js
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    define: { timestamps: true, underscored: true },
  },
  test: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db_test",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    define: { timestamps: true, underscored: true },
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "loka_db",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
    define: { timestamps: true, underscored: true },
  },
};
```

---

## 5. Instance Sequelize — `src/database/index.ts`

Point d'entrée de la connexion à la base :

```ts
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
 * Tester la connexion
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
 * Synchroniser les modèles (dev uniquement)
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
```

---

## 6. Créer un modèle (Entity) — `src/modules/user/user.model.ts`

Exemple complet avec le modèle **User** :

```ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../database";

// Attributs du modèle
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

// Attributs optionnels à la création
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
```

> **`underscored: true`** → les colonnes en base utilisent le `snake_case` (`first_name`), tandis que le code TypeScript utilise le `camelCase` (`firstName`).

---

## 7. Créer une migration

### 7.1 Générer le squelette (optionnel)

```bash
npx sequelize-cli migration:generate --name create-users
```

### 7.2 Fichier de migration — `src/database/migrations/20260220000001-create-users.js`

```js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM("admin", "manager", "tenant", "owner"),
        allowNull: false,
        defaultValue: "tenant",
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Index unique sur l'email
    await queryInterface.addIndex("users", ["email"], {
      unique: true,
      name: "idx_users_email",
    });

    // Index sur le rôle pour le filtrage
    await queryInterface.addIndex("users", ["role"], {
      name: "idx_users_role",
    });
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable("users");
  },
};
```

---

## 8. Créer un seed

### 8.1 Générer le squelette (optionnel)

```bash
npx sequelize-cli seed:generate --name demo-users
```

### 8.2 Fichier de seed — `src/database/seeders/20260220000001-demo-users.js`

```js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Admin",
        last_name: "Loka",
        email: "admin@loka.com",
        phone: "+33600000000",
        role: "admin",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jean",
        last_name: "Dupont",
        email: "jean.dupont@email.com",
        phone: "+33612345678",
        role: "owner",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Marie",
        last_name: "Martin",
        email: "marie.martin@email.com",
        phone: "+33698765432",
        role: "tenant",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
```

---

## 9. Exécuter la première migration

### Prérequis : Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE loka_db;

# Quitter
\q
```

### Lancer la migration

```bash
# Exécuter toutes les migrations
pnpm db:migrate

# Charger les données de seed
pnpm db:seed
```

### Vérifier que ça a fonctionné

```bash
psql -U postgres -d loka_db -c "SELECT * FROM users;"
```

---

## 10. Scripts utiles (`package.json`)

```json
{
  "scripts": {
    "db:migrate": "npx sequelize-cli db:migrate",
    "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
    "db:seed": "npx sequelize-cli db:seed:all",
    "db:seed:undo": "npx sequelize-cli db:seed:undo:all",
    "db:reset": "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
  }
}
```

| Script                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `pnpm db:migrate`      | Exécuter les migrations en attente        |
| `pnpm db:migrate:undo` | Annuler la dernière migration             |
| `pnpm db:seed`         | Insérer les données de seed               |
| `pnpm db:seed:undo`    | Supprimer les données de seed             |
| `pnpm db:reset`        | Reset complet : undo all → migrate → seed |

---

## 11. Structure finale du projet

```
src/
├── config/
│   ├── database.ts        ← Config TS (runtime)
│   └── database.js        ← Config JS (sequelize-cli)
├── database/
│   ├── index.ts           ← Instance Sequelize + connexion
│   ├── migrations/
│   │   └── 20260220000001-create-users.js
│   └── seeders/
│       └── 20260220000001-demo-users.js
├── modules/
│   └── user/
│       ├── user.model.ts      ← Modèle Sequelize
│       ├── user.service.ts    ← Logique métier
│       ├── user.controller.ts ← Handlers HTTP
│       ├── user.routes.ts     ← Routes Express
│       └── index.ts           ← Re-exports
├── app.ts
└── server.ts
.sequelizerc                   ← Config chemins sequelize-cli
.env                           ← Variables d'environnement
```

---

## Résumé rapide — de l'installation à la première migration

```bash
# 1. Installer les dépendances
pnpm add sequelize pg pg-hstore
pnpm add -D sequelize-cli

# 2. Configurer .env, .sequelizerc, database.ts/js

# 3. Créer la base PostgreSQL
psql -U postgres -c "CREATE DATABASE loka_db;"

# 4. Créer la migration
npx sequelize-cli migration:generate --name create-users

# 5. Remplir le fichier de migration (voir section 7)

# 6. Exécuter la migration
pnpm db:migrate

# 7. Créer et exécuter le seed
npx sequelize-cli seed:generate --name demo-users
pnpm db:seed

# 8. Lancer l'API
pnpm dev
# → Swagger UI : http://localhost:3000/api-docs
```
