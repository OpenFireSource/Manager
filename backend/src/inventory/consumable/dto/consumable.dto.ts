import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { ConsumableGroupDto } from '../../consumable-group/dto/consumable-group.dto';
import { ConsumableLocationDto } from './consumable-location.dto';

export class ConsumableDto {
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
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notice?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Type(() => ConsumableGroupDto)
  group?: ConsumableGroupDto;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  consumableLocationIds?: number[];

  @ApiProperty({
    required: false,
    nullable: true,
    type: [ConsumableLocationDto],
  })
  @Expose()
  @Type(() => ConsumableLocationDto)
  consumableLocations?: ConsumableLocationDto[];
}
