import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsumableService } from './consumable.service';
import { ConsumableDbService } from './consumable-db.service';
import { ConsumableEntity } from './consumable.entity';
import { LocationEntity } from '../../base/location/location.entity';
import { ConsumableCreateDto } from './dto/consumable-create.dto';

describe('ConsumableService', () => {
  let service: ConsumableService;
  let dbService: ConsumableDbService;
  let consumableRepo: Repository<ConsumableEntity>;
  let locationRepo: Repository<LocationEntity>;

  const mockDbService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getCount: jest.fn(),
  };

  const mockConsumableRepo = {
    createQueryBuilder: jest.fn(() => ({
      relation: jest.fn(() => ({
        of: jest.fn(() => ({
          add: jest.fn(),
          remove: jest.fn(),
          loadMany: jest.fn(),
        })),
      })),
    })),
  };

  const mockLocationRepo = {
    findByIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumableService,
        {
          provide: ConsumableDbService,
          useValue: mockDbService,
        },
        {
          provide: getRepositoryToken(ConsumableEntity),
          useValue: mockConsumableRepo,
        },
        {
          provide: getRepositoryToken(LocationEntity),
          useValue: mockLocationRepo,
        },
      ],
    }).compile();

    service = module.get<ConsumableService>(ConsumableService);
    dbService = module.get<ConsumableDbService>(ConsumableDbService);
    consumableRepo = module.get<Repository<ConsumableEntity>>(getRepositoryToken(ConsumableEntity));
    locationRepo = module.get<Repository<LocationEntity>>(getRepositoryToken(LocationEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a consumable', async () => {
    const createDto: ConsumableCreateDto = {
      name: 'Test Consumable',
      notice: 'Test notice',
      quantity: 10,
      expirationDate: new Date('2025-12-31'),
      groupId: 1,
      locationIds: [1, 2],
    };

    const mockEntity = {
      id: 1,
      name: 'Test Consumable',
      notice: 'Test notice',
      quantity: 10,
      expirationDate: new Date('2025-12-31'),
      groupId: 1,
    };

    const mockLocations = [
      { id: 1, name: 'Location 1' },
      { id: 2, name: 'Location 2' },
    ];

    mockDbService.create.mockResolvedValue(mockEntity);
    mockDbService.findOne.mockResolvedValue(mockEntity);
    mockLocationRepo.findByIds.mockResolvedValue(mockLocations);

    const result = await service.create(createDto);

    expect(result).toEqual(mockEntity);
    expect(dbService.create).toHaveBeenCalledWith({
      name: 'Test Consumable',
      notice: 'Test notice',
      quantity: 10,
      expirationDate: new Date('2025-12-31'),
      groupId: 1,
    });
    expect(dbService.findOne).toHaveBeenCalledWith(1);
    expect(locationRepo.findByIds).toHaveBeenCalledWith([1, 2]);
  });

  it('should get count of consumables', async () => {
    const mockCount = { count: 5 };
    mockDbService.getCount.mockResolvedValue(5);

    const result = await service.getCount();

    expect(result).toEqual(mockCount);
    expect(dbService.getCount).toHaveBeenCalledWith(undefined);
  });
});