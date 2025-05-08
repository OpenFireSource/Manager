import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleDto {
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  description: string;
}
