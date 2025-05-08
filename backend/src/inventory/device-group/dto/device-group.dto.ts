import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
  MaxLength,
} from 'class-validator';

export class DeviceGroupDto {
  @ApiProperty()
  @Expose()
  @IsPositive()
  @IsDefined()
  @IsInt()
  id: number;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @Length(1, 100)
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @MaxLength(2000)
  notice?: string;
}
