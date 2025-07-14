import { OmitType } from '@nestjs/swagger';
import { DeviceDto } from './device.dto';

export class DeviceUpdateDto extends OmitType(DeviceDto, [
  'id',
  'type',
  'defaultImage',
  'images',
  'location',
  'group',
] as const) {}
