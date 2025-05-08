import { OmitType } from '@nestjs/swagger';
import { LocationDto } from './location.dto';

export class LocationCreateDto extends OmitType(LocationDto, [
  'id',
  'parent',
  'children',
] as const) {}
