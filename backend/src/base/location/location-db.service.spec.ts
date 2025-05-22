import { Test, TestingModule } from '@nestjs/testing';
import { LocationDbService } from './location-db.service';
import { TreeRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { NotFoundException } from '@nestjs/common';

describe('LocationDbService', () => {
  let service: LocationDbService;
  let repoMock: TreeRepository<LocationEntity>;

  beforeEach(async () => {
    repoMock = {} as TreeRepository<LocationEntity>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationDbService,
        {
          provide: getRepositoryToken(LocationEntity),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<LocationDbService>(LocationDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getCount', async () => {
    repoMock.count = jest.fn().mockResolvedValue(5);
    expect(await service.getCount()).toBe(5);
  });

  describe('findAll', () => {
    it('should return all locations', async () => {
      const locations = [new LocationEntity(), new LocationEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(locations),
      });

      expect(await service.findAll(0, 10)).toEqual(locations);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all locations, with presets for limit an offset', async () => {
      const locations = [new LocationEntity(), new LocationEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(locations),
      });

      expect(await service.findAll(10, 10)).toEqual(locations);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all locations, with presets for limit an offset and ordering #1', async () => {
      const locations = [new LocationEntity(), new LocationEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(locations),
      });

      expect(
        await service.findAll(undefined, undefined, 'name', undefined),
      ).toEqual(locations);
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(100);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(0);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalledWith(
        'l.name',
        'ASC',
      );
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });

    it('should return all locations, with presets for limit an offset and ordering #2', async () => {
      const locations = [new LocationEntity(), new LocationEntity()];
      repoMock.createQueryBuilder = jest.fn().mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(locations),
      });

      expect(await service.findAll(10, 10, 'parent.name', undefined)).toEqual(
        locations,
      );
      expect(repoMock.createQueryBuilder).toHaveBeenCalled();
      expect(
        repoMock.createQueryBuilder().leftJoinAndSelect,
      ).toHaveBeenCalled();
      expect(repoMock.createQueryBuilder().limit).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().offset).toHaveBeenCalledWith(10);
      expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalledWith(
        'p.name',
        'ASC',
      );
      expect(repoMock.createQueryBuilder().getMany).toHaveBeenCalled();
    });
  });

  it('findOne', async () => {
    const location = new LocationEntity();
    repoMock.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(location),
    });

    expect(await service.findOne(1)).toEqual(location);
    expect(repoMock.createQueryBuilder).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().where).toHaveBeenCalledWith(
      'l.id = :id',
      { id: 1 },
    );
    expect(repoMock.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().orderBy).toHaveBeenCalled();
    expect(repoMock.createQueryBuilder().getOne).toHaveBeenCalled();
  });

  it('create', async () => {
    const location = new LocationEntity();
    repoMock.save = jest.fn().mockResolvedValue(location);

    expect(await service.create(location)).toEqual(location);
    expect(repoMock.save).toHaveBeenCalledWith(location);
  });

  describe('isChildOf', () => {
    it('should return true if the location is a child of the parent', async () => {
      const locationId = 1;
      const parentId = 2;
      const parent = new LocationEntity();
      parent.id = parentId;
      repoMock.findOneBy = jest.fn().mockResolvedValue(parent);
      repoMock.findAncestors = jest
        .fn()
        .mockResolvedValue([{ id: locationId }, { id: parentId }]);

      expect(await service.isChildOf(locationId, parentId)).toBe(true);
    });

    it('should return false if the location is not a child of the parent', async () => {
      const locationId = 1;
      const parentId = 2;
      const parent = new LocationEntity();
      parent.id = parentId;
      repoMock.findOneBy = jest.fn().mockResolvedValue(parent);
      repoMock.findAncestors = jest
        .fn()
        .mockResolvedValue([{ id: 3 }, { id: 4 }]);

      expect(await service.isChildOf(locationId, parentId)).toBe(false);
    });

    it('should return false if no parents are found', async () => {
      const locationId = 1;
      const parentId = 2;
      repoMock.findOneBy = jest.fn().mockResolvedValue(null);
      repoMock.findAncestors = jest.fn();

      expect(await service.isChildOf(locationId, parentId)).toBe(false);
      expect(repoMock.findAncestors).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    it('should update a location', async () => {
      const id = 1;
      const data = { name: 'Updated Location' };
      const location = new LocationEntity();
      location.id = id;
      repoMock.findOneBy = jest.fn().mockResolvedValue(location);
      repoMock.save = jest.fn().mockResolvedValue({ ...location, ...data });

      await service.update(id, data);

      expect(repoMock.findOneBy).toHaveBeenCalledWith({ id });
      expect(repoMock.save).toHaveBeenCalledWith({
        ...location,
        ...data,
      });
    });

    it('should update a location with parent', async () => {
      const id = 1;
      const data = { name: 'Updated Location', parentId: 2 };
      const location = new LocationEntity();
      location.id = id;

      const parent = new LocationEntity();
      parent.id = 2;

      repoMock.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(location)
        .mockResolvedValueOnce(parent);

      repoMock.save = jest.fn().mockResolvedValue({ ...location, ...data });

      await service.update(id, data);

      expect(repoMock.findOneBy).toHaveBeenCalledTimes(2);
      expect(repoMock.save).toHaveBeenCalledWith({
        ...location,
        ...data,
      });
    });

    it('should throw NotFoundException if location is not found', async () => {
      const id = 1;
      const data = { name: 'Updated Location' };
      repoMock.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, data)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('should throw NotFoundException if parent is not found', async () => {
      const id = 1;
      const data = { name: 'Updated Location', parentId: 2 };
      const location = new LocationEntity();
      location.id = id;
      location.parentId = 2;
      repoMock.findOneBy = jest
        .fn()
        .mockResolvedValueOnce(location)
        .mockResolvedValueOnce(null);

      await expect(service.update(id, data)).rejects.toThrowError(
        new NotFoundException(),
      );
      expect(repoMock.findOneBy).toHaveBeenCalledTimes(2);
    });
  });

  describe('delete', () => {
    it('should delete a location', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 1 });

      expect(await service.delete(id)).toBe(true);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if location is not found #1', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: 0 });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });

    it('should return false if location is not found #2', async () => {
      const id = 1;
      repoMock.delete = jest.fn().mockResolvedValue({ affected: undefined });

      expect(await service.delete(id)).toBe(false);
      expect(repoMock.delete).toHaveBeenCalledWith(id);
    });
  });
});
