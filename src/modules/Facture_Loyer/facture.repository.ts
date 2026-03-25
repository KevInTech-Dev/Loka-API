import { BaseRepositoryImpl } from "@/common/base.repository";
import { FactureLoyer, FactureLoyerAttributes } from "@/database/models/FactureLoyer";
import { CreationAttributes } from "sequelize";


export class FactureLoyerRepository extends BaseRepositoryImpl<FactureLoyer> {
    constructor() {
        super(FactureLoyer)
    }
    //Creer facture Loyer 
    async create(data: CreationAttributes<FactureLoyer>): Promise<FactureLoyer> {
        return this.model.create(data);
    }

    //Find facture Loyer by id
    async findById(id: string) {
        return this.model.findByPk(id);
    }

    //Find all paginated facture Loyer
    async getFactureLoyerPaginated(page: number, limit: number) {
        const offset = (page - 1) * limit;
        return this.model.findAndCountAll({ offset, limit })
    }

    //Find Facture Loyer By Attribut
    async getFactureLoyerByAttribut(attribut: keyof FactureLoyerAttributes, value: string) {
        return this.model.findOne({
            where: {
                [attribut]: value
            }
        });
    }

    //Vérifier si il existe déjà une facture pour le locataire
    isFactureExistingForTenant = async (idTenant: string, idUnitLocation: string): Promise<Boolean> => {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(todayStart);
        todayEnd.setHours(23, 59, 59, 999)
        if (await this.model.findOne({
            where: {
                idTenant: idTenant,
                unitLocation: idUnitLocation,
                dateEmission: {
                    [this.Op.gte]: todayStart,
                    [this.Op.lte]: todayEnd
                }
            }
        })) {
            return true;
        } else {
            return false;
        }
    }

    //Recuperer le dernier numero de facture
    getLastInvNumber = async (): Promise<number> => {
        return this.model.count()
    }

    async isThereInvoice(idTenant: keyof FactureLoyerAttributes, value: string) {
        const aujourdhui = new Date();
        return this.model.findOne({
            where: {
                [idTenant]: value,
                dateEmission: aujourdhui
            }
        })
    }
}