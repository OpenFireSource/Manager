import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn } from 'class-validator';
import { ImageService } from '../../core/services/storage/image.service';

export class ImageDownloadQuerysDto {
  @ApiProperty()
  @IsDefined()
  @IsIn([...ImageService.sizes.map((x) => 'webp-' + x), '', 'webp-600-blur'])
  size: string;
}
