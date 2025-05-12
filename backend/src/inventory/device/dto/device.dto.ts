import { EquipmentState } from '../device.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { DeviceTypeDto } from '../../device-type/dto/device-type.dto';
import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class DeviceDto {
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
  @IsString()
  @MaxLength(100)
  manufactor?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  dealer?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serial?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  serialManufactor?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode1?: string;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode2?: string;

  @ApiProperty({ required: false, nullable: true, type: Date })
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  producedDate?: Date;

  @ApiProperty({ required: false, nullable: true, type: Date })
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  activeDate?: Date;

  @ApiProperty({ required: false, nullable: true, type: Date })
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  decomissionDateManufacture?: Date;

  @ApiProperty({ required: false, nullable: true, type: Date })
  @Expose()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  decomissionDate?: Date;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsEnum(EquipmentState)
  state: EquipmentState;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  typeId?: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Type(() => DeviceTypeDto)
  type?: DeviceTypeDto;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @ApiProperty({ required: false, nullable: true })
  @Expose()
  @Type(() => DeviceTypeDto)
  group?: DeviceTypeDto;
}
