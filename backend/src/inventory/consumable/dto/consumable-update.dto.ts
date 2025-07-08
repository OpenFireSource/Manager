import { PartialType } from '@nestjs/swagger';
import { ConsumableCreateDto } from './consumable-create.dto';

export class ConsumableUpdateDto extends PartialType(ConsumableCreateDto) {}
