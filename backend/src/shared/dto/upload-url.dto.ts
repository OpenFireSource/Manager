import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

class FormData {
  @ApiProperty()
  @Expose()
  bucket: string;

  @ApiProperty()
  @Expose()
  key: string;

  @ApiProperty()
  @Expose()
  'Content-Type': string;

  @ApiProperty()
  @Expose()
  'x-amz-date': string;

  @ApiProperty()
  @Expose()
  'x-amz-algorithm': string;

  @ApiProperty()
  @Expose()
  'x-amz-credential': string;

  @ApiProperty()
  @Expose()
  'x-amz-signature': string;

  @ApiProperty()
  @Expose()
  policy: string;
}

export class UploadUrlDto {
  @ApiProperty()
  @Expose()
  postURL: string;

  @ApiProperty()
  @Expose()
  @Type(() => FormData)
  formData: { [key: string]: any };
}
