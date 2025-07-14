import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DownloadUrlDto {
  @ApiProperty()
  @Expose()
  url: string;
}
