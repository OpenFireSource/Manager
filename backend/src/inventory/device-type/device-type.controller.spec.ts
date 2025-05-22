import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTypeController } from './device-type.controller';
import { DeviceTypeService } from './device-type.service';

describe('DeviceTypeController', () => {
  let controller: DeviceTypeController;
  let service: DeviceTypeService;

  beforeEach(async () => {
    service = {} as DeviceTypeService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceTypeController],
      providers: [
        {
          provide: DeviceTypeService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<DeviceTypeController>(DeviceTypeController);
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
    const mockDeviceTypes = [{ id: 1, name: 'Device Type 1' }];
    service.findAll = jest.fn().mockResolvedValue(mockDeviceTypes);

    const result = await controller.getAll({ offset: 0, limit: 10 }, {});

    expect(service.findAll).toHaveBeenCalledWith(0, 10, undefined, undefined);
    expect(result).toEqual(mockDeviceTypes);
  });

  it('getOne', async () => {
    const mockDeviceType = { id: 1, name: 'Device Type 1' };
    service.findOne = jest.fn().mockResolvedValue(mockDeviceType);

    const result = await controller.getOne({ id: 1 });

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDeviceType);
  });

  it('create', async () => {
    const mockDeviceType = { id: 1, name: 'Device Type 1' };
    service.create = jest.fn().mockResolvedValue(mockDeviceType);

    const result = await controller.create({ name: 'Device Type 1' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'Device Type 1' });
    expect(result).toEqual(mockDeviceType);
  });

  it('update', async () => {
    const mockDeviceType = { id: 1, name: 'Updated Device Type' };
    service.update = jest.fn().mockResolvedValue(mockDeviceType);

    const result = await controller.update({ id: 1 }, {
      name: 'Updated Device Type',
    } as any);

    expect(service.update).toHaveBeenCalledWith(1, {
      name: 'Updated Device Type',
    });
    expect(result).toEqual(mockDeviceType);
  });

  it('delete', async () => {
    service.delete = jest.fn().mockResolvedValue(undefined);

    await controller.delete({ id: 1 });

    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
