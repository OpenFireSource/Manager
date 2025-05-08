import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserUpdateDto extends OmitType(UserDto, [
  'id',
  'username',
] as const) {}
