// src/models/Utilisateur_Abonnement.ts
import { Model, DataTypes, Sequelize, DATE } from 'sequelize';
import {StatusAbonnementEnum} from '@/enums/StatusAbonnement';

export interface UtilisateurAbonnementAttributes {
  id: string;
  utilisateurId: string;
  status: StatusAbonnementEnum,
  abonnementId: string;
  autoRenouvellement: Boolean;
  startDate: Date,
  endDate: Date,
  createdAt?: Date;
  updatedAt?: Date;
}

export class Utilisateur_Abonnement extends Model<UtilisateurAbonnementAttributes>
  implements UtilisateurAbonnementAttributes {
  declare id: string;
  declare utilisateurId: string;
  declare status: StatusAbonnementEnum;
  declare abonnementId: string;
  declare autoRenouvellement: Boolean;
  declare startDate: Date;
  declare endDate: Date;
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
      status: {
        type: DataTypes.ENUM(...Object.values(StatusAbonnementEnum)),
        allowNull: false,
        defaultValue: StatusAbonnementEnum.ACTIVE,

      },
      abonnementId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'abonnements', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      autoRenouvellement: {
        type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
      },

      startDate: {
        type: DataTypes. DATE,
        allowNull: false,
      },

      endDate:{
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Utilisateur_Abonnement',
      tableName: 'utilisateur_abonnements',
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );
};

export { initModelUtilisateur_Abonnement };

