import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

const orderDirectionValues = ['ASC', 'DESC'];
export type OrderDirection = 'ASC' | 'DESC';

export abstract class OrderDto {
  @ApiProperty({
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(orderDirectionValues)
  order?: OrderDirection;
}
