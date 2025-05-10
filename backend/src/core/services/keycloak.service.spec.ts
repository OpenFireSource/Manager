import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakService } from './keycloak.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';

const mockConfigService = {
  get: jest.fn(),
};

const mockLogger = {
  debug: jest.fn(),
};

describe('KeycloakService', () => {
  let service: KeycloakService;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        'KEYCLOAK.url': 'url',
        'KEYCLOAK.realm': 'realm',
        'KEYCLOAK.clientId': 'clientId',
        'KEYCLOAK.clientSecret': 'secret',
      };
      return config[key];
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeycloakService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: HttpService,
          useValue: undefined,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<KeycloakService>(KeycloakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
