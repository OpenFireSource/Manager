import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GroupDto } from '../../group/dto/group.dto';

export class UserGroupsDto {
  @ApiProperty({ type: [GroupDto] })
  @Expose()
  groups: GroupDto[];

  @ApiProperty({ type: [GroupDto] })
  @Expose()
  members: GroupDto[];
}
