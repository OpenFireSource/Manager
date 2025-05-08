import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsUUID } from 'class-validator';

/**
 * DTO for an ID that is a GUID.
 */
export class IdGuidDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID()
  id: string;
}
