import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class DeviceGetQueryDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  typeId?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  locationId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'name',
    'manufactor',
    'dealer',
    'serial',
    'serialManufactor',
    'barcode1',
    'barcode2',
    'producedDate',
    'activeDate',
    'decomissionDateManufacture',
    'decomissionDate',
    'state',
    'type.name',
    'group.name',
    'location.name',
  ])
  sortCol?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortDir?: 'ASC' | 'DESC';
}
