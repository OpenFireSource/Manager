import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

/**
 * DTO for an ID that is a GUID.
 */
export class ImageIdGuidDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  imageId: string;
}
