import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CountDto {
  @ApiProperty()
  @Expose()
  count: number;
}
