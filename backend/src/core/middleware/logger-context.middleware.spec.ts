import { LoggerContextMiddleware } from './logger-context.middleware';
import { RequestContextService } from '../services/request-context.service';
import { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

jest.mock('../services/request-context.service');
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(() => ({
    debug: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  })),
}));

const mockRequestContextService = new RequestContextService();
const mockLogger = new Logger();

let mockRequest: Request;
let mockResponse: Response;

const mockNextFunction = jest.fn();

describe('LoggerContextMiddleware', () => {
  let middleware: LoggerContextMiddleware;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = new LoggerContextMiddleware(mockRequestContextService);
    middleware.logger = mockLogger;
    mockRequestContextService.run = jest
      .fn()
      .mockImplementation((callback) => callback());
  });

  it('should log request start and end with proxy', () => {
    mockResponse = {
      on: jest.fn(),
      statusCode: 200,
    } as any;
    mockRequest = {
      headers: {
        'x-forwarded-for': '192.168.1.1',
        'user-agent': 'jest-agent',
      },
      socket: { remoteAddress: '127.0.0.1' },
      baseUrl: '/api/test',
      method: 'GET',
    } as any;

    middleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockRequestContextService.run).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenNthCalledWith(1, 'Request Started', {
      ip: '192.168.1.1',
      userAgent: 'jest-agent',
      url: '/api/test',
      method: 'GET',
    });
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should log request start and end', () => {
    mockResponse = {
      on: jest.fn(),
      statusCode: 200,
    } as any;
    mockRequest = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      baseUrl: '/api/test',
      method: 'GET',
    } as any;

    middleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockRequestContextService.run).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenNthCalledWith(1, 'Request Started', {
      ip: '127.0.0.1',
      userAgent: '',
      url: '/api/test',
      method: 'GET',
    });
    expect(mockNextFunction).toHaveBeenCalled();
  });

  it('should log request completion on response finish', () => {
    mockResponse = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') callback();
      }),
      statusCode: 200,
    } as any;

    middleware.use(mockRequest, mockResponse, mockNextFunction);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      'Request completed',
      expect.objectContaining({
        statusCode: 200,
        durationMs: expect.any(Number),
      }),
    );
  });
});
