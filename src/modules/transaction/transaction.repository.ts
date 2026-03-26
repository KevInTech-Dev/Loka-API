import { BaseRepositoryImpl } from "@/common/base.repository";
import { Payment } from "@/database/models/payment";
import { Transactions } from "@/database/models/Transaction";
import { RoleEnum } from "@/enums/RoleEnum";
import { CreationAttributes } from "sequelize";


export class TransactionRepository extends BaseRepositoryImpl<Transactions> {
    constructor() {
        super(Transactions);
    }

    async create(transactionData: CreationAttributes<Transactions>): Promise<Transactions> {
        return this.model.create(transactionData);
    }

    async findById(id: string): Promise<Transactions> {
        return this.model.findByPk(id, {
            include: [{
                model: Payment,
                as: 'transactionPayment'
            }
            ]
        });
    }
    async getTransactionPaginated(page: number, limit: number, role: string, userId: string) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.model.findAndCountAll({
            where: {
                ...(role === RoleEnum.PROPRIETAIRE && {
                    landlord_id: {
                        includes: [{ model: Payment, as: 'transactionPayment', where: { id: userId } }]
                    }
                }),
                ...(role === RoleEnum.LOCATAIRE && {
                    tenant_id: {
                        includes: [{ model: Payment, as: 'transactionPayment', where: { id: userId } }]
                    }
                }),
            },
            limit,
            offset,
            include: [{
                model: Payment,
                as: 'transactionPayment'
            }]
        });
        return { rows, count };
    }

}