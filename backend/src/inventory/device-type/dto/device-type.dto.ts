import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
  MaxLength,
} from 'class-validator';

export class DeviceTypeDto {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsPositive()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @Length(1, 100)
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @MaxLength(2000)
  notice?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsNumber()
  pricePerUnit?: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @MaxLength(100)
  manufactor?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @MaxLength(100)
  dealer?: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsBoolean()
  visualInspectionAfterUsage: boolean;
}
