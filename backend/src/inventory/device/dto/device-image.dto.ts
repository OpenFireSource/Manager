import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DeviceImageDto {
  @ApiProperty()
  @Expose()
  id: string;
}
