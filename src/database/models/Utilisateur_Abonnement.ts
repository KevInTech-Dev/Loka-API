// src/models/Utilisateur_Abonnement.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UtilisateurAbonnementAttributes {
  id: string;
  utilisateurId: string;
  abonnementId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Utilisateur_Abonnement extends Model<UtilisateurAbonnementAttributes>
  implements UtilisateurAbonnementAttributes {
  declare id: string;
  declare utilisateurId: string;
  declare abonnementId: string;
  declare readonly createdAt?: Date;
  declare readonly updatedAt?: Date;

  static associate(models: any) {
    // Définit les associations envers User et Abonnement
    Utilisateur_Abonnement.belongsTo(models.User, {
      foreignKey: 'utilisateurId',
      as: 'utilisateur',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    Utilisateur_Abonnement.belongsTo(models.Abonnement, {
      foreignKey: 'abonnementId',
      as: 'abonnement',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

const initModelUtilisateur_Abonnement = (sequelize: Sequelize) => {
  Utilisateur_Abonnement.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUID,
        primaryKey: true,
      },
      utilisateurId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      abonnementId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'abonnements', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Utilisateur_Abonnement',
      tableName: 'utilisateur_abonnements',
      timestamps: true,
      underscored: true,
    }
  );
};

export { initModelUtilisateur_Abonnement };

