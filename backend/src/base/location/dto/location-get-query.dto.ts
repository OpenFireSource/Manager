import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class LocationGetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'name', 'type', 'parent.name'])
  sortCol?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortDir?: 'ASC' | 'DESC';
}
