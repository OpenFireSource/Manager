import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class ConsumableGetQueryDto {
  @ApiProperty({ required: false, nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  groupId?: number;

  @ApiProperty({ required: false, nullable: true, type: [Number] })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(id => parseInt(id, 10));
    }
    return value;
  })
  @IsInt({ each: true })
  @IsPositive({ each: true })
  locationIds?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'name',
    'quantity',
    'expirationDate',
    'group.name',
  ])
  sortCol?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortDir?: 'ASC' | 'DESC';
}