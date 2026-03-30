import env from "@/config/env";
import { Transaction } from "fedapay";

export class FedapayEnvConfig {
    async exportFedapayEnvConfig(): Promise<Transaction> {
        const { FedaPay, Transaction } = require('fedapay');
        FedaPay.setApiKey(env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment(env.FEDAPAY_ENVIRONNEMENT);

        return Transaction;
    }
}
