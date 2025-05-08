import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UserCreateDto extends OmitType(UserDto, ['id'] as const) {}
