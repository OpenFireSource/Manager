import { Test, TestingModule } from '@nestjs/testing';
import { ConsumableGroupService } from './consumable-group.service';
import { ConsumableGroupDbService } from './consumable-group-db.service';
import { ConsumableGroupCreateDto } from './dto/consumable-group-create.dto';

describe('ConsumableGroupService', () => {
  let service: ConsumableGroupService;
  let dbService: ConsumableGroupDbService;

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
        ConsumableGroupService,
        {
          provide: ConsumableGroupDbService,
          useValue: mockDbService,
        },
      ],
    }).compile();

    service = module.get<ConsumableGroupService>(ConsumableGroupService);
    dbService = module.get<ConsumableGroupDbService>(ConsumableGroupDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a consumable group', async () => {
    const createDto: ConsumableGroupCreateDto = {
      name: 'Test Consumable Group',
      notice: 'Test notice',
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

  it('should get count of consumable groups', async () => {
    const mockCount = { count: 5 };
    mockDbService.getCount.mockResolvedValue(5);

    const result = await service.getCount();

    expect(result).toEqual(mockCount);
    expect(dbService.getCount).toHaveBeenCalledWith(undefined);
  });
});