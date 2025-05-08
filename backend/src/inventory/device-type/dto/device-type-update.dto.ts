import { OmitType } from '@nestjs/swagger';
import { DeviceTypeDto } from './device-type.dto';

export class DeviceTypeUpdateDto extends OmitType(DeviceTypeDto, [
  'id',
] as const) {}
