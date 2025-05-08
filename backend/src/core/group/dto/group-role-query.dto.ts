import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Length } from 'class-validator';

export class GroupRoleQueryDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @Length(1, 255)
  role: string;
}
