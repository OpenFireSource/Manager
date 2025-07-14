import { OmitType } from '@nestjs/swagger';
import { ConsumableGroupDto } from './consumable-group.dto';

export class ConsumableGroupCreateDto extends OmitType(ConsumableGroupDto, [
  'id',
] as const) {}
