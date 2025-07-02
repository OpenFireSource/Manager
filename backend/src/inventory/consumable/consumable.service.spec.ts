import { Test, TestingModule } from '@nestjs/testing';
import { ConsumableService } from './consumable.service';
import { ConsumableDbService } from './consumable-db.service';
import { ConsumableCreateDto } from './dto/consumable-create.dto';

describe('ConsumableService', () => {
  let service: ConsumableService;
  let dbService: ConsumableDbService;

  const mockDbService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumableService,
        {
          provide: ConsumableDbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<ConsumableService>(ConsumableService);
    dbService = module.get<ConsumableDbService>(ConsumableDbService);
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
      locationId: 1,
    };

    const mockEntity = {
      id: 1,
      ...createDto,
    };

    mockDbService.create.mockResolvedValue(mockEntity);
    mockDbService.findOne.mockResolvedValue(mockEntity);

    const result = await service.create(createDto);

    expect(result).toEqual(mockEntity);
    expect(dbService.create).toHaveBeenCalledWith(createDto);
    expect(dbService.findOne).toHaveBeenCalledWith(1);
  });

  it('should get count of consumables', async () => {
    const mockCount = { count: 5 };
    mockDbService.getCount.mockResolvedValue(5);

    const result = await service.getCount();

    expect(result).toEqual(mockCount);
    expect(dbService.getCount).toHaveBeenCalledWith(undefined);
  });
});