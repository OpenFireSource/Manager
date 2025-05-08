import { OmitType } from '@nestjs/swagger';
import { DeviceGroupDto } from './device-group.dto';

export class DeviceGroupUpdateDto extends OmitType(DeviceGroupDto, [
  'id',
] as const) {}
