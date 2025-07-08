import { OmitType } from '@nestjs/swagger';
import { ConsumableDto } from './consumable.dto';

export class ConsumableCreateDto extends OmitType(ConsumableDto, [
  'id',
  'group',
  'consumableLocations',
  'consumableLocationIds',
] as const) {}
