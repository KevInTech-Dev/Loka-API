import { BaseRepositoryImpl } from "@/common/base.repository";
import { NotFoundError } from "@/common/errors";
import { Payment } from "@/database/models/payment";
import { TransactionCreationAttributes, Transactions } from "@/database/models/Transaction";
import { RoleEnum } from "@/enums/RoleEnum";
import { CreationAttributes, where } from "sequelize";


export class TransactionRepository extends BaseRepositoryImpl<Transactions> {
    constructor() {
        super(Transactions);
    }

    async create(transactionData: CreationAttributes<Transactions>): Promise<Transactions> {
        return this.model.create(transactionData);
    }

    async getTransactionById(idTransaction: string) {
        return this.model.findOne({
            where: {
                idFedapay: idTransaction,
            }
        })
    }



    async findByIdWithAccess(id: string, opts: { role: string, senderId?: string }): Promise<Transactions> {

        return this.model.findOne({
            where: {
                ...opts.role === RoleEnum.ADMIN ? { id } : { id, sender_id: opts.senderId }
            },
            include: [{
                model: Payment,
                as: 'transactionPayment'
            }
            ],
        });
    }
    async getTransactionPaginated(page: number, limit: number, opts: { role: string, senderId?: string }) {
        const offset = (page - 1) * limit;
        const { rows, count } = await this.model.findAndCountAll({
            where: {
                ...opts.role === RoleEnum.ADMIN ? {} : { sender_id: opts.senderId }
            },
            limit,
            offset,
            include: [{
                model: Payment,
                as: 'transactionPayment'
            }],
            order: [['createdAt', 'DESC']]
        });
        return { rows, count };
    }

    // async updateTransactions(id: string, data: TransactionCreationAttributes) {
    //     const transactionObject = await this.findById(id);
    //     if (!transactionObject) {
    //         throw new NotFoundError("TRANSACTION NOT FOUND");
    //     }
    //     return await transactionObject.update(data, {
    //         where: {
    //             id: transactionObject.id
    //         }
    //     });
    // }
}