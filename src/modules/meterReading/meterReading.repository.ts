import { BaseRepositoryImpl } from "@/common/base.repository";
import { LandLord } from "@/database/models/landLord";
import { MeterReading } from "@/database/models/meter_reading";
import { Property } from "@/database/models/Property";
import { Tenant } from "@/database/models/Tenants";
import { UnitLocation } from "@/database/models/UnitLocation";
import { MeterTypeEnum } from "@/enums/MeterTypeEnum";
import { CreationAttributes, } from "sequelize";

export class MeterReadingRepository extends BaseRepositoryImpl<MeterReading> {
  constructor() {
    super(MeterReading);
  }

  async create(data: CreationAttributes<MeterReading>): Promise<MeterReading> {
    return this.model.create(data);
  }

  async findById(id: string) {
    return this.model.findByPk(id,
      {
        include: [
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

  async getMeterReadingPaginated(page: number, limit: number) {
    const offset = (page - 1) * limit;
    return this.model.findAll({
      offset, limit, include: [
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
      ]
    });
  }

  async getLatestReadingValue(unit_id: string, meterType: MeterTypeEnum): Promise<MeterReading | null> {
    return await this.model.findOne({
      where: {
        unit_id: unit_id,
        meter_type: meterType
      },
      order: [['createdAt', 'DESC']]
    });
  }

  async checkMeterReading(
    landlord_id: string,
    property_id: string,
    unit_id: string,
    tenant_id: string,
    meter_type: string,
    meter_value: number
  ): Promise<Boolean> {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 599)
    const object = await this.model.findOne({
      where: {
        landlord_id: landlord_id,
        property_id: property_id,
        unit_id: unit_id,
        tenant_id: tenant_id,
        meter_type: meter_type,
        meter_value: meter_value,
        createdAt: {
          [this.Op.gte]: todayStart,
          [this.Op.lte]: todayEnd
        }
      }
    })
    if (object) {
      return true;
    } else {
      return false;
    }
  }

}