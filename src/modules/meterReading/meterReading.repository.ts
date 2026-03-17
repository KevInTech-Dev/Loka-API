import { BaseRepositoryImpl } from "@/common/base.repository";
import { LandLord } from "@/database/models/landLord";
import {   MeterReading } from "@/database/models/meter_reading";
import { Property } from "@/database/models/Property";
import { Tenant } from "@/database/models/Tenants";
import { UnitLocation } from "@/database/models/UnitLocation";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { CreationAttributes, } from "sequelize";

export class MeterReadingRepository  extends BaseRepositoryImpl<MeterReading> {    
    constructor() {
        super(MeterReading);
    }

    async create(data: CreationAttributes<MeterReading>): Promise<MeterReading> {
        return this.model.create(data);
    }

    async findById(id: string){
        return this.model.findByPk(id, 
            {include:[
                {
                  model: LandLord,
                  as: 'meterReadingLandlord',  
                },
                {
                  model: Property,
                  as: 'meterReadingProperty',
                },
                {
                  model: UnitLocation,
                  as: 'meterReadingUnit'
                },
                {
                  model: Tenant,
                  as: 'meterReadingTenant'
                }
            ], 
        });
    }

    async getMeterReadingPaginated(page: number, limit: number){
        const offset = (page - 1) * limit;
        return this.model.findAll({ offset, limit, include: [
                {
                  model: LandLord,
                  as: 'meterReadingLandlord',  
                },
                {
                  model: Property,
                  as: 'meterReadingProperty',
                },
                {
                  model: UnitLocation,
                  as: 'meterReadingUnit'
                },
                {
                  model: Tenant,
                  as: 'meterReadingTenant'
                },
        ]});
    }

    async getLatestReadingValue(unit_id: string, meterType: MeterTypeEnum): Promise<MeterReading | null> {
      return await this.model.findOne({
        where : {
          unit_id: unit_id,
          meter_type: meterType
        },
        order: [['createdAt', 'DESC']]
      });
    }
}