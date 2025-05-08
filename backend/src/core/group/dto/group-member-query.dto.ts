import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class GroupMemberQueryDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  userId: string;
}
