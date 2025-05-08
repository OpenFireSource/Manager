import { OmitType } from '@nestjs/swagger';
import { GroupDto } from './group.dto';

export class GroupCreateDto extends OmitType(GroupDto, [
  'id',
  'roles',
] as const) {}
