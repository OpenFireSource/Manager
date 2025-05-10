import { Test, TestingModule } from '@nestjs/testing';
import { DeviceGroupDbService } from './device-group-db.service';
import { Repository } from 'typeorm';
import { DeviceGroupEntity } from './device-group.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeviceGroupDbService', () => {
  let service: DeviceGroupDbService;
  let repoMock: Repository<DeviceGroupEntity>;

  beforeEach(async () => {
    repoMock = {} as Repository<DeviceGroupEntity>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceGroupDbService,
        {
          provide: getRepositoryToken(DeviceGroupEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<DeviceGroupDbService>(DeviceGroupDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('getCount', async () => {
    repoMock.count = jest.fn().mockResolvedValue(5);
    expect(await service.getCount()).toBe(5);
  });

  describe('findAll', () => {
    it('should return all', async () => {
      const devices = [new DeviceGroupEntity(), new DeviceGroupEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
      });

      expect(await service.findAll(0, 10)).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all devices, with presets for limit an offset', async () => {
      const devices = [new DeviceGroupEntity(), new DeviceGroupEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(devices),
      });

      expect(await service.findAll()).toEqual(devices);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(100);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  it('findOne', async () => {
    const device = new DeviceGroupEntity();
    repoMock.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(device),
    });

    expect(await service.findOne(1)).toEqual(device);
    expect(repoMock.createQueryBuilder).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().where).toHaveBeenCalledWith(
      'dg.id = :id',
      { id: 1 },
    );
    expect(repoMock.createQueryBuilder().getOne).toHaveBeenCalled();
  });

  it('create', async () => {
    const device = new DeviceGroupEntity();
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
      const data = new DeviceGroupEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.update(id, data)).toBe(true);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device is not found #1', async () => {
      const id = 1;
      const data = new DeviceGroupEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device is not found #2', async () => {
      const id = 1;
      const data = new DeviceGroupEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });
  });
});
