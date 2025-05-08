import { OmitType } from '@nestjs/swagger';
import { GroupDto } from './group.dto';

export class GroupUpdateDto extends OmitType(GroupDto, [
  'id',
  'roles',
] as const) {}
