import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../services/request-context.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  logger = new Logger(LoggerContextMiddleware.name);

  constructor(private readonly contextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    const requestId = uuidv4(undefined, undefined);
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const url = req.baseUrl;
    const method = req.method;

    this.contextService.run(() => {
      this.contextService.set('requestId', requestId);
      this.logger.debug('Request Started', {
        ip,
        userAgent,
        url,
        method,
      });

      res.on('finish', () => {
        const duration = Date.now() - startTime;
        this.logger.debug('Request completed', {
          statusCode: res.statusCode,
          durationMs: duration,
        });
      });

      next();
    }, {});
  }
}
