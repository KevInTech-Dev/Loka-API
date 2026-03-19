import { PaymentRepository } from "./payment.repository";
import { CreatePaymentInput } from "./payment.schema";
import { PaymentMapper } from "./payment.mappers";
import { TenantRepository } from "../tenant/tenant.repository";
import { landLordRepository } from "../landLord/landlord.repository";

export class PaymentService {
    private paymentRepository: PaymentRepository
    private paymentMapper: PaymentMapper
    private landlordRepository: landLordRepository;
    private tenantRepository: TenantRepository;
    private factureRepository: FactureRepository;   

    constructor() {
        this.paymentRepository = new PaymentRepository()
        this.paymentMapper = new PaymentMapper()
        this.landlordRepository = new landLordRepository();
        this.tenantRepository = new TenantRepository();
        this.factureRepository = new FactureRepository();
    }

    async createPayment(paymentData: CreatePaymentInput): Promise<PaymentResponse> {
        const 


        return
    }
}