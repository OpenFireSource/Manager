import { LocationType } from '../location.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsPositive()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsEnum(LocationType)
  type: LocationType;

  @ApiProperty({ required: false, nullable: true, default: null })
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  parentId?: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Type(() => LocationDto)
  children?: LocationDto[];

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Type(() => LocationDto)
  parent?: LocationDto;
}
