import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    service = {} as LocationService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getCount', async () => {
    const mockCount = 5;
    service.getCount = jest.fn().mockResolvedValue(mockCount);

    const result = await controller.getCount();

    expect(service.getCount).toHaveBeenCalled();
    expect(result).toEqual(mockCount);
  });

  it('getAll', async () => {
    const mockLocations = [{ id: 1, name: 'Location 1' }];
    service.findAll = jest.fn().mockResolvedValue(mockLocations);

    const result = await controller.getAll({ offset: 0, limit: 10 }, {});

    expect(service.findAll).toHaveBeenCalledWith(0, 10, undefined, undefined);
    expect(result).toEqual(mockLocations);
  });

  it('getOne', async () => {
    const mockLocation = { id: 1, name: 'Location 1' };
    service.findOne = jest.fn().mockResolvedValue(mockLocation);

    const result = await controller.getOne({ id: 1 });

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockLocation);
  });

  it('create', async () => {
    const mockLocation = { id: 1, name: 'Location 1' };
    service.create = jest.fn().mockResolvedValue(mockLocation);

    const result = await controller.create({ name: 'Location 1' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'Location 1' });
    expect(result).toEqual(mockLocation);
  });

  it('update', async () => {
    const mockLocation = { id: 1, name: 'Updated Location' };
    service.update = jest.fn().mockResolvedValue(mockLocation);

    const result = await controller.update({ id: 1 }, {
      name: 'Updated Location',
    } as any);

    expect(service.update).toHaveBeenCalledWith(1, {
      name: 'Updated Location',
    });
    expect(result).toEqual(mockLocation);
  });

  it('delete', async () => {
    service.delete = jest.fn().mockResolvedValue(undefined);

    await controller.delete({ id: 1 });

    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
