import { PartialType } from '@nestjs/swagger';
import { ConsumableGroupCreateDto } from './consumable-group-create.dto';

export class ConsumableGroupUpdateDto extends PartialType(
  ConsumableGroupCreateDto,
) {}
