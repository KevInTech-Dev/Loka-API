// src/models/Utilisateur_Abonnement.ts
import {DataTypes, Model, Optional, Sequelize} from 'sequelize';
import {StatusAbonnementEnum} from '@/enums/StatusAbonnement';
import {BaseModel} from '@/common/models/base.model';

export interface UtilisateurAbonnementAttributes extends BaseModel {
  utilisateurId: string;
  status: StatusAbonnementEnum,
  abonnementId: string;
  autoRenouvellement: Boolean;
  startDate: Date,
  endDate: Date,
}

export interface UtilisateurAbonnementCreationAttributes extends Optional<UtilisateurAbonnementAttributes, "id" | "createdAt" | "updatedAt"> { }

export class Utilisateur_Abonnement extends Model<UtilisateurAbonnementAttributes, UtilisateurAbonnementCreationAttributes>
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

    Utilisateur_Abonnement.hasMany(models.permissionsAbonnement, {
      foreignKey: "idAbonnement",
      as: "idAbonnement"
    })


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
        defaultValue: DataTypes.UUIDV4,
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
        defaultValue: StatusAbonnementEnum.INACTIVE,

      },
      abonnementId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.DATE,
        allowNull: true,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
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

