import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

export class UserGroupQueryDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  groupId: string;
}
