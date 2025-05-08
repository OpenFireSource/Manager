import { OmitType } from '@nestjs/swagger';
import { DeviceGroupDto } from './device-group.dto';

export class DeviceGroupCreateDto extends OmitType(DeviceGroupDto, [
  'id',
] as const) {}
