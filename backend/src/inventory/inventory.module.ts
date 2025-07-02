import { Module } from '@nestjs/common';
import { DeviceTypeController } from './device-type/device-type.controller';
import { DeviceTypeService } from './device-type/device-type.service';
import { DeviceTypeDbService } from './device-type/device-type-db.service';
import { DeviceTypeEntity } from './device-type/device-type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceGroupController } from './device-group/device-group.controller';
import { DeviceGroupService } from './device-group/device-group.service';
import { DeviceGroupDbService } from './device-group/device-group-db.service';
import { DeviceGroupEntity } from './device-group/device-group.entity';
import { DeviceController } from './device/device.controller';
import { DeviceService } from './device/device.service';
import { DeviceDbService } from './device/device-db.service';
import { DeviceEntity } from './device/device.entity';
import { DeviceImageEntity } from './device/device-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceTypeEntity,
      DeviceGroupEntity,
      DeviceEntity,
      DeviceImageEntity,
    ]),
  ],
  controllers: [DeviceTypeController, DeviceGroupController, DeviceController],
  providers: [
    DeviceTypeService,
    DeviceTypeDbService,
    DeviceGroupService,
    DeviceGroupDbService,
    DeviceService,
    DeviceDbService,
  ],
  exports: [DeviceService],
})
export class InventoryModule {}
