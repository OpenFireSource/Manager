import { Test, TestingModule } from '@nestjs/testing';
import { StartupService } from './startup.service';
import { MinioService } from './storage/minio.service';
import { KeycloakService } from './keycloak.service';
import { Logger } from '@nestjs/common';

describe('StartupService', () => {
  let service: StartupService;
  let minioService: MinioService;
  let keycloakService: KeycloakService;

  beforeEach(async () => {
    minioService = {} as MinioService;
    keycloakService = {} as KeycloakService;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StartupService,
        {
          provide: MinioService,
          useValue: minioService,
        },
        {
          provide: KeycloakService,
          useValue: keycloakService,
        },
        {
          provide: Logger,
          useValue: { debug: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<StartupService>(StartupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call setupEnvironment on minioService and keycloakService', async () => {
    minioService.setupEnvironment = jest.fn();
    keycloakService.setupEnvironment = jest.fn();

    await service.init();

    expect(minioService.setupEnvironment).toHaveBeenCalled();
    expect(keycloakService.setupEnvironment).toHaveBeenCalled();
  });
});
