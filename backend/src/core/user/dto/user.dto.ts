import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UserDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @Length(1, 40)
  firstName: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @Length(1, 40)
  lastName: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @Length(3, 30)
  @Matches(/^[a-zA-Z0-9][a-zA-Z0-9_\-.]{1,28}[a-zA-Z0-9]$/)
  username: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsString()
  @IsEmail({ allow_display_name: false, allow_ip_domain: false })
  email?: string;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsBoolean()
  emailVerified?: boolean;

  @ApiProperty()
  @Expose()
  @IsDefined()
  @IsBoolean()
  enabled: boolean;
}
