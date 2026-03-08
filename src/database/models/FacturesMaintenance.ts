import { BaseModel } from "@/common/models/base.model";
import {Facture, FactureAttributes} from "./Facture";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";

export interface FactureMaintenanceAttributes extends FactureAttributes {
    unitLocation: string;
    idTenant: string;
    maintenanceId: string;
}

export interface FactureMaintenanceCreationAttributes extends Optional<FactureMaintenanceAttributes, "id"|"createdAt"|"updatedAt">{}

class FactureMaintenance extends Model<FactureMaintenanceAttributes,FactureMaintenanceCreationAttributes> implements FactureMaintenanceAttributes {
    declare readonly createdAt?: Date;
    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare id: string;
    declare idTenant: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare maintenanceId: string;
    declare notes: string;
    declare numeroFacture: string;
    declare status: StatusFactures;
    declare unitLocation: string;
    declare readonly updatedAt?: Date;

}

const initModelFactureMiantenance = (sequelize:Sequelize)=>{
    FactureMaintenance.init({
        id:{
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        dateEcheance:{

        },
        dateEmission:{

        },
        idTenant:{

        },
        invoiceType:{

        },
        isTva:{

        },
        maintenanceId:{

        },
        notes:{

        },
        numeroFacture:{

        },
        status:{

        },
        unitLocation:{

        }
    },{
        sequelize,
        tableName:'factureMaintenance',
        modelName:'FactureMaintenance',
        timestamps:true,
        underscored: true,
        paranoid: true
    });
}