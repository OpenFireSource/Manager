import { Test, TestingModule } from '@nestjs/testing';
import { DeviceTypeDbService } from './device-type-db.service';
import { DeviceTypeEntity } from './device-type.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DeviceTypeDbService', () => {
  let service: DeviceTypeDbService;
  let repoMock: Repository<DeviceTypeEntity>;

  beforeEach(async () => {
    repoMock = {} as Repository<DeviceTypeEntity>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceTypeDbService,
        {
          provide: getRepositoryToken(DeviceTypeEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<DeviceTypeDbService>(DeviceTypeDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCount', async () => {
    repoMock.count = jest.fn().mockResolvedValue(5);
    expect(await service.getCount()).toBe(5);
  });

  describe('findAll', () => {
    it('should return all device-types', async () => {
      const deviceTypes = [new DeviceTypeEntity(), new DeviceTypeEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(deviceTypes),
      });

      expect(await service.findAll(0, 10)).toEqual(deviceTypes);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all device-types by type', async () => {
      const deviceTypes = [new DeviceTypeEntity(), new DeviceTypeEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(deviceTypes),
        where: jest.fn().mockReturnThis(),
      });

      expect(await service.findAll(0, 10)).toEqual(deviceTypes);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all device-types, with presets for limit an offset', async () => {
      const deviceTypes = [new DeviceTypeEntity(), new DeviceTypeEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(deviceTypes),
      });

      expect(await service.findAll()).toEqual(deviceTypes);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(100);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all device-types, with presets for limit an offset and ordering', async () => {
      const deviceTypes = [new DeviceTypeEntity(), new DeviceTypeEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(deviceTypes),
      });

      expect(await service.findAll(10, 10, 'name')).toEqual(deviceTypes);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalledWith('dt.name', 'ASC');
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  it('findOne', async () => {
    const deviceType = new DeviceTypeEntity();
    repoMock.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(deviceType),
    });

    expect(await service.findOne(1)).toEqual(deviceType);
    expect(repoMock.createQueryBuilder).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().where).toHaveBeenCalledWith(
      'dt.id = :id',
      { id: 1 },
    );
    expect(repoMock.createQueryBuilder().getOne).toHaveBeenCalled();
  });

  it('create', async () => {
    const deviceType = new DeviceTypeEntity();
    repoMock.save = jest.fn().mockResolvedValue(deviceType);

    expect(await service.create(deviceType)).toEqual(deviceType);
    expect(repoMock.save).toHaveBeenCalledWith(deviceType);
  });

  describe('delete', () => {
    it('should delete a device-type', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.delete(id)).toBe(true);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if device-type is not found #1', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if device-type is not found #2', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a device-type', async () => {
      const id = 1;
      const data = new DeviceTypeEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.update(id, data)).toBe(true);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device-type is not found #1', async () => {
      const id = 1;
      const data = new DeviceTypeEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });

    it('should return false if device-type is not found #2', async () => {
      const id = 1;
      const data = new DeviceTypeEntity();
      repoMock.update = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.update(id, data)).toBe(false);
      expect(repoMock.update).toHaveBeenCalledWith(id, data);
    });
  });
});
