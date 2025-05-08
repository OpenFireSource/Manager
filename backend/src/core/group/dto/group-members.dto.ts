import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/dto/user.dto';
import { Expose } from 'class-transformer';

export class GroupMembersDto {
  @ApiProperty({ type: [UserDto] })
  @Expose()
  members: UserDto[];

  @ApiProperty({ type: [UserDto] })
  @Expose()
  users: UserDto[];
}
