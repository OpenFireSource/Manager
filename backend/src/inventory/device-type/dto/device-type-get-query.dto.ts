import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class DeviceTypeGetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'name',
    'pricePerUnit',
    'manufactor',
    'dealer',
    'visualInspectionAfterUsage',
  ])
  sortCol?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortDir?: 'ASC' | 'DESC';
}
