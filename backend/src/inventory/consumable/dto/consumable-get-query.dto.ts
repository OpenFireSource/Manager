import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class ConsumableGetQueryDto {
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
    'quantity',
    'expirationDate',
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