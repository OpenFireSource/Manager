import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { LocationDto } from '../../../base/location/dto/location.dto';

export class ConsumableLocationDto {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: false, nullable: true, type: Date })
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expirationDate?: Date;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  locationId: number;

  @ApiProperty({ required: false, nullable: true, type: LocationDto })
  @Expose()
  @Type(() => LocationDto)
  location?: LocationDto;
}
