import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilenameDto {

  @ApiProperty()
  @IsDefined()
  @IsString()
  contentType: string;
}
