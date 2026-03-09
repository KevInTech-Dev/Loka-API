import {FactureAttributes} from "@database/models/Facture";
import {DataTypes, Model, Optional, Sequelize} from "sequelize";
import {InvoiceType} from "@/enums/InvoiceTypeEnume";
import {StatusFactures} from "@/enums/StatusFacturesEnum";

export interface FactureEauAttributes extends FactureAttributes {
    
    unitLocation: string;
    idTenant: string;
    idReleveCompteur: string;
    totalAPayer: number;
}

export interface FactureEauCreationAttributes extends Optional<FactureEauAttributes,"id"|"createdAt"|"updatedAt">{}

class FactureEau extends Model<FactureEauAttributes,FactureEauCreationAttributes> implements FactureEauAttributes{

    declare dateEcheance: Date;
    declare dateEmission: Date;
    declare id: string;
    declare idReleveCompteur: string;
    declare idTenant: string;
    declare invoiceType: InvoiceType;
    declare isTva: boolean;
    declare notes: string;
    declare numeroFacture: string;
    declare status: StatusFactures;
    declare totalAPayer: number;
    declare unitLocation: string;
    declare readonly updatedAt?: Date;
    declare readonly createdAt?: Date;

}

const initModelFactureEau = (sequelize:Sequelize)=>{
    FactureEau.init(
        {
            id:{
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            dateEcheance:{

            },
            dateEmission:{

            },
            idReleveCompteur:{

            },
            idTenant:{

            },
            invoiceType:{

            },
            idTva:{

            },
            notes:{

            },
            numeroFacture:{

            },
            status:{

            },
            totalAPayer:{

            },
            unitLocation:{

            }
        },{
            sequelize,
            modelName: "FactureEau",
            tableName: "facturesEau",
            timestamps: true,
            underscored: true,
            paranoid: true
        }
    );
}

export{FactureEau,initModelFactureEau}