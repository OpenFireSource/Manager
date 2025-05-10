import { Test, TestingModule } from '@nestjs/testing';
import { MinioService } from './minio.service';
import { Client } from 'minio';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

jest.mock('minio');

const mockConfigService = {
  get: jest.fn(),
};

const mockLogger = {
  debug: jest.fn(),
};

const mockClient = {
  bucketExists: jest.fn(),
  makeBucket: jest.fn(),
};

Client.prototype.bucketExists = mockClient.bucketExists;
Client.prototype.makeBucket = mockClient.makeBucket;

describe('MinioService', () => {
  let service: MinioService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        'MINIO.accessKey': 'test-access-key',
        'MINIO.secretKey': 'test-secret-key',
        'MINIO.useSsl': true,
        'MINIO.host': 'localhost',
        'MINIO.port': 9000,
        'MINIO.bucketName': 'test-bucket',
        'MINIO.uploadExpiry': 3600,
        'MINIO.downloadExpiry': 3600,
      };
      return config[key];
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinioService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<MinioService>(MinioService);
  });

  it('should initialize the Minio client with correct config', () => {
    expect(service).toBeDefined();
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.accessKey');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.secretKey');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.useSsl');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.host');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.port');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.bucketName');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.uploadExpiry');
    expect(mockConfigService.get).toHaveBeenCalledWith('MINIO.downloadExpiry');
  });
  it('should setup the Minio environment correctly', async () => {
    mockClient.bucketExists.mockResolvedValue(false);
    mockClient.makeBucket.mockResolvedValue(undefined);

    await service.setupEnvironment();

    expect(mockClient.bucketExists).toHaveBeenCalledWith('test-bucket');
    expect(mockClient.makeBucket).toHaveBeenCalledWith('test-bucket');
    expect(mockLogger.debug).toHaveBeenCalledWith('Minio-Setup gestartet');
    expect(mockLogger.debug).toHaveBeenCalledWith('Minio Bucket erstellt');
    expect(mockLogger.debug).toHaveBeenCalledWith('Minio-Setup abgeschlossen');
  });

  it('should not create a bucket if it already exists', async () => {
    mockClient.bucketExists.mockResolvedValue(true);

    await service.setupEnvironment();

    expect(mockClient.bucketExists).toHaveBeenCalledWith('test-bucket');
    expect(mockClient.makeBucket).not.toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalledWith('Minio-Setup gestartet');
    expect(mockLogger.debug).toHaveBeenCalledWith('Minio-Setup abgeschlossen');
  });
});
