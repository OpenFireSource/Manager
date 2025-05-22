import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class DeviceGroupGetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['id', 'name'])
  sortCol?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortDir?: 'ASC' | 'DESC';
}
