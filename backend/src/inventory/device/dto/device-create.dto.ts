import { OmitType } from '@nestjs/swagger';
import { DeviceDto } from './device.dto';

export class DeviceCreateDto extends OmitType(DeviceDto, [
  'id',
  'type',
  'defaultImage',
  'defaultImageId',
  'images',
  'location',
  'group',
] as const) {}
