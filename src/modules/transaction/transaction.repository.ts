import { BaseRepositoryImpl } from "@/common/base.repository";
import { Payment } from "@/database/models/payment";
import { Transaction } from "@/database/models/Transaction";
import { RoleEnum } from "@/enums/RoleEnum";
import { CreationAttributes } from "sequelize";


export class TransactionRepository extends BaseRepositoryImpl<Transaction> {
    constructor() {
        super(Transaction);
    }

    async create(transactionData: CreationAttributes<Transaction>): Promise<Transaction> {
        return this.model.create(transactionData);
    }

    async findByIdWithAccess(id: string, opts: { role: string , senderId?: string }): Promise<Transaction> {
        
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
            where:  {
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
}