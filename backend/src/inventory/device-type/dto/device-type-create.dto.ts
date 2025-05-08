import { OmitType } from '@nestjs/swagger';
import { DeviceTypeDto } from './device-type.dto';

export class DeviceTypeCreateDto extends OmitType(DeviceTypeDto, [
  'id',
] as const) {}
