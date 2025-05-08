import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString, IsUUID, Length } from 'class-validator';

export class GroupDto {
  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsUUID()
  id: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @Length(1, 70)
  name: string;

  @ApiProperty({ required: false })
  @Expose()
  roles?: string[];
}
