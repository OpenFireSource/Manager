import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DeviceGetQueryDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  typeId?: number;
}
