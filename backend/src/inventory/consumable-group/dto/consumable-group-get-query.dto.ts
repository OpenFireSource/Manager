import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ConsumableGroupGetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortCol?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsString()
  sortDir?: 'ASC' | 'DESC';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;
}
