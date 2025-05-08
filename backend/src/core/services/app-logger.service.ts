import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { Logger } from 'winston';
import { RequestContextService } from './request-context.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
    private readonly contextService: RequestContextService,
  ) {}

  log(message: any, ...context: any[]) {
    this.winstonLogger.info(message, this.getMeta(context));
  }

  error(message: any, trace?: string, ...context: any[]) {
    this.winstonLogger.error(message, { ...this.getMeta(context), trace });
  }

  warn(message: any, ...context: any[]) {
    this.winstonLogger.warn(message, this.getMeta(context));
  }

  debug(message: any, ...context: any[]) {
    this.winstonLogger.debug(message, this.getMeta(context));
  }

  verbose(message: any, ...context: any[]) {
    this.winstonLogger.verbose(message, this.getMeta(context));
  }

  private getMeta(context?: any[]) {
    return {
      timestamp: new Date().toISOString(),
      requestId: this.contextService.get('requestId') || null,
      userId: this.contextService.get('userId') || null,
      context: context || null,
    };
  }
}
