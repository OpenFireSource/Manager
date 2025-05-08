import { IsDefined, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IdNumberDto {
  @ApiProperty()
  @Type(() => Number)
  @IsDefined()
  @IsNumber()
  @IsPositive()
  id: number;
}
