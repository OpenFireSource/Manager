import { Test, TestingModule } from '@nestjs/testing';
import { DeviceDbService } from './device-db.service';
import { Repository } from 'typeorm';
import { DeviceEntity } from './device.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeviceDbService', () => {
  let service: DeviceDbService;
  let repoMock: Repository<DeviceEntity>;

  beforeEach(async () => {
    repoMock = {} as Repository<DeviceEntity>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceDbService,
        {
          provide: getRepositoryToken(DeviceEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<DeviceDbService>(DeviceDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCount', async () => {
    repoMock.count = jest.fn().mockResolvedValue(5);
    expect(await service.getCount()).toBe(5);
  });

  describe('findAll', () => {
    it('should return all devices', async () => {
      const devices = [new DeviceEntity(), new DeviceEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
      });

      expect(await service.findAll(0, 10)).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalledTimes(2);
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all devices by type', async () => {
      const devices = [new DeviceEntity(), new DeviceEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
        where: jest.fn().mockReturnThis(),
      });

      expect(await service.findAll(0, 10, 1)).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().where).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all devices by group', async () => {
      const devices = [new DeviceEntity(), new DeviceEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
        where: jest.fn().mockReturnThis(),
      });

      expect(await service.findAll(0, 10, undefined, 1)).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().where).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all devices, with presets for limit an offset', async () => {
      const devices = [new DeviceEntity(), new DeviceEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
      });

      expect(await service.findAll()).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(100);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  it('findOne', async () => {
    const device = new DeviceEntity();
    repoMock.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(device),
    });

    expect(await service.findOne(1)).toEqual(device);
    expect(repoMock.createQueryBuilder).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().where).toHaveBeenCalledWith(
      'd.id = :id',
      { id: 1 },
    );
    expect(repoMock.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().getOne).toHaveBeenCalled();
  });

  it('create', async () => {
    const device = new DeviceEntity();
    repoMock.save = jest.fn().mockResolvedValue(device);

    expect(await service.create(device)).toEqual(device);
    expect(repoMock.save).toHaveBeenCalledWith(device);
  });

  describe('delete', () => {
    it('should delete a device', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.delete(id)).toBe(true);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if device is not found #1', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if device is not found #2', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a device', async () => {
      const id = 1;
      const data = new DeviceEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.update(id, data)).toBe(true);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device is not found #1', async () => {
      const id = 1;
      const data = new DeviceEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device is not found #2', async () => {
      const id = 1;
      const data = new DeviceEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });
  });
});
