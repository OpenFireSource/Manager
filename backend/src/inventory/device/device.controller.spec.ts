import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;

  beforeEach(async () => {
    service = {} as DeviceService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
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
    const mockDevices = [{ id: 1, name: 'Device 1' }];
    service.findAll = jest.fn().mockResolvedValue(mockDevices);

    const result = await controller.getAll({ offset: 0, limit: 10 });

    expect(service.findAll).toHaveBeenCalledWith(0, 10, undefined, undefined, undefined);
    expect(result).toEqual(mockDevices);
  });

  it('getOne', async () => {
    const mockDevice = { id: 1, name: 'Device 1' };
    service.findOne = jest.fn().mockResolvedValue(mockDevice);

    const result = await controller.getOne({ id: 1 });

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDevice);
  });

  it('create', async () => {
    const mockDevice = { id: 1, name: 'Device 1' };
    service.create = jest.fn().mockResolvedValue(mockDevice);

    const result = await controller.create({ name: 'Device 1' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'Device 1' });
    expect(result).toEqual(mockDevice);
  });

  it('update', async () => {
    const mockDevice = { id: 1, name: 'Updated Device' };
    service.update = jest.fn().mockResolvedValue(mockDevice);

    const result = await controller.update({ id: 1 }, {
      name: 'Updated Device',
    } as any);

    expect(service.update).toHaveBeenCalledWith(1, {
      name: 'Updated Device',
    });
    expect(result).toEqual(mockDevice);
  });

  it('delete', async () => {
    service.delete = jest.fn().mockResolvedValue(undefined);

    await controller.delete({ id: 1 });

    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
