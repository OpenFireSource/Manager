import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsumableService } from './consumable.service';
import { ConsumableDbService } from './consumable-db.service';
import { ConsumableEntity } from './consumable.entity';
import { LocationEntity } from '../../base/location/location.entity';
import { ConsumableCreateDto } from './dto/consumable-create.dto';
import { LocationDbService } from '../../base/location/location-db.service';

describe('ConsumableService', () => {
  let service: ConsumableService;
  let dbService: ConsumableDbService;
  let locationDbService: LocationDbService;

  const mockDbService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getCount: jest.fn(),
  };

  const locationDbServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumableService,
        {
          provide: ConsumableDbService,
          useValue: mockDbService,
        },
        {
          provide: LocationDbService,
          useValue: locationDbServiceMock,
        },
      ],
    }).compile();

    service = module.get<ConsumableService>(ConsumableService);
    dbService = module.get<ConsumableDbService>(ConsumableDbService);
    locationDbService = module.get<LocationDbService>(LocationDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
