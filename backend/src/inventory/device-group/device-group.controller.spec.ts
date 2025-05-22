import { Test, TestingModule } from '@nestjs/testing';
import { DeviceGroupController } from './device-group.controller';
import { DeviceGroupService } from './device-group.service';

describe('DeviceGroupController', () => {
  let controller: DeviceGroupController;
  let service: DeviceGroupService;

  beforeEach(async () => {
    service = {} as DeviceGroupService;
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceGroupController],
      providers: [
        {
          provide: DeviceGroupService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<DeviceGroupController>(DeviceGroupController);
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
    const mockDeviceGroups = [{ id: 1, name: 'Device Group 1' }];
    service.findAll = jest.fn().mockResolvedValue(mockDeviceGroups);

    const result = await controller.getAll({ offset: 0, limit: 10 }, {});

    expect(service.findAll).toHaveBeenCalledWith(0, 10, undefined, undefined);
    expect(result).toEqual(mockDeviceGroups);
  });

  it('getOne', async () => {
    const mockDeviceGroup = { id: 1, name: 'Device Group 1' };
    service.findOne = jest.fn().mockResolvedValue(mockDeviceGroup);

    const result = await controller.getOne({ id: 1 });

    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDeviceGroup);
  });

  it('create', async () => {
    const mockDeviceGroup = { id: 1, name: 'Device Group 1' };
    service.create = jest.fn().mockResolvedValue(mockDeviceGroup);

    const result = await controller.create({ name: 'Device Group 1' } as any);

    expect(service.create).toHaveBeenCalledWith({ name: 'Device Group 1' });
    expect(result).toEqual(mockDeviceGroup);
  });

  it('update', async () => {
    const mockDeviceGroup = { id: 1, name: 'Updated Device Group' };
    service.update = jest.fn().mockResolvedValue(mockDeviceGroup);

    const result = await controller.update({ id: 1 }, {
      name: 'Updated Device Group',
    } as any);

    expect(service.update).toHaveBeenCalledWith(1, {
      name: 'Updated Device Group',
    });
    expect(result).toEqual(mockDeviceGroup);
  });

  it('delete', async () => {
    service.delete = jest.fn().mockResolvedValue(undefined);

    await controller.delete({ id: 1 });

    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
