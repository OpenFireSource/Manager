import { AppLoggerService } from './app-logger.service';
import { RequestContextService } from './request-context.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('./request-context.service');

const mockWinstonLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
};

const mockRequestContextService = new RequestContextService();

describe('AppLoggerService', () => {
  let service: AppLoggerService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppLoggerService,
        { provide: WINSTON_MODULE_PROVIDER, useValue: mockWinstonLogger },
        { provide: RequestContextService, useValue: mockRequestContextService },
      ],
    }).compile();

    service = module.get<AppLoggerService>(AppLoggerService);
  });

  it('should log messages correctly', () => {
    mockRequestContextService.get = jest
      .fn()
      .mockImplementation((key) => (key === 'requestId' ? '1234' : null));
    service.log('Test log message');
    expect(mockWinstonLogger.info).toHaveBeenCalledWith(
      'Test log message',
      expect.objectContaining({
        requestId: '1234',
        userId: null,
      }),
    );
  });

  it('should handle error logging with trace', () => {
    mockRequestContextService.get = jest
      .fn()
      .mockImplementation((key) => (key === 'requestId' ? '1234' : null));
    service.error('Test error message', 'Error trace');
    expect(mockWinstonLogger.error).toHaveBeenCalledWith(
      'Test error message',
      expect.objectContaining({
        requestId: '1234',
        userId: null,
        trace: 'Error trace',
      }),
    );
  });

  it('should log warnings correctly', () => {
    service.warn('Test warning message');
    expect(mockWinstonLogger.warn).toHaveBeenCalledWith(
      'Test warning message',
      expect.objectContaining({
        requestId: '1234',
        userId: null,
      }),
    );
  });

  it('should log debug messages correctly', () => {
    service.debug('Test debug message');
    expect(mockWinstonLogger.debug).toHaveBeenCalledWith(
      'Test debug message',
      expect.objectContaining({
        requestId: '1234',
        userId: null,
      }),
    );
  });

  it('should log verbose messages correctly', () => {
    mockRequestContextService.get = jest.fn().mockReturnValue(null);
    service.verbose('Test verbose message');
    expect(mockWinstonLogger.verbose).toHaveBeenCalledWith(
      'Test verbose message',
      expect.objectContaining({
        requestId: null,
        userId: null,
      }),
    );
  });
});
