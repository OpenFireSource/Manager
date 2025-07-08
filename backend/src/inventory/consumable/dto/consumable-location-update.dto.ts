import { OmitType } from '@nestjs/swagger';
import { ConsumableLocationDto } from './consumable-location.dto';

export class ConsumableLocationUpdateDto extends OmitType(
  ConsumableLocationDto,
  ['id', 'location'] as const,
) {}
