import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

interface ErrorCode {
  message: string;
  statusCode: number;
}

export const ErrorCodes: { [key: string]: ErrorCode } = {
  /**
   * Das Objekt kann nicht gelöscht werden, da es noch Abhängigkeiten hat.
   */
  RELATIONS_EXISTS: {
    statusCode: 1,
    message:
      'Das Objekt kann nicht gelöscht werden, da es noch Abhängigkeiten hat.',
  },
};

export class ErrorDto {
  @ApiProperty()
  @Expose()
  message: string;
  @ApiProperty()
  @Expose()
  statusCode: number;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }

  public static fromErrorCode(statusCode: ErrorCode): ErrorDto {
    return new ErrorDto(statusCode.message, statusCode.statusCode);
  }
}
