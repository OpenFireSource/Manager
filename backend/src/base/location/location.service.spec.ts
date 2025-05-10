import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { LocationCreateDto } from './dto/location-create.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LocationDbService } from './location-db.service';
import { LocationEntity } from './location.entity';
import { LocationUpdateDto } from './dto/location-update.dto';

describe('LocationService', () => {
  let service: LocationService;
  let dbService: LocationDbService;

  beforeEach(async () => {
    dbService = {} as LocationDbService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: LocationDbService,
          useValue: dbService,
        },
      ],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll with correct parameters', async () => {
      const offset = 0;
      const limit = 10;
      dbService.findAll = jest.fn().mockResolvedValue([]);

      expect(await service.findAll(offset, limit)).toEqual([]);

      expect(dbService.findAll).toHaveBeenCalledWith(offset, limit);
    });
    it('should call findAll with no parameters', async () => {
      dbService.findAll = jest.fn().mockResolvedValue([]);

      expect(await service.findAll()).toEqual([]);

      expect(dbService.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const id = 1;
      const location = new LocationEntity();
      dbService.findOne = jest.fn().mockResolvedValue(location);

      expect(await service.findOne(id)).toEqual(location);

      expect(dbService.findOne).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      dbService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(dbService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should call delete with correct parameters', async () => {
      const id = 1;
      dbService.delete = jest.fn().mockResolvedValue(true);

      await service.delete(id);

      expect(dbService.delete).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      dbService.delete = jest.fn().mockResolvedValue(false);

      await expect(service.delete(id)).rejects.toThrow(new NotFoundException());

      expect(dbService.delete).toHaveBeenCalledWith(id);
    });
  });

  it('getCount', async () => {
    const count = 5;
    dbService.getCount = jest.fn().mockResolvedValue(count);

    expect(await service.getCount()).toEqual({ count });

    expect(dbService.getCount).toHaveBeenCalled();
  });

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      const body = new LocationCreateDto();
      const createdLocation = { id: 1, ...body };
      dbService.create = jest.fn().mockResolvedValue(createdLocation);
      dbService.findOne = jest.fn().mockResolvedValue(createdLocation);

      expect(await service.create(body)).toEqual(createdLocation);

      expect(dbService.create).toHaveBeenCalledWith(body);
    });

    it('should throw InternalServerErrorException if location not found', async () => {
      const body = new LocationCreateDto();
      dbService.create = jest.fn().mockResolvedValue({ id: 1 });
      dbService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(dbService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const id = 1;
      const body = new LocationCreateDto();
      dbService.update = jest.fn().mockResolvedValue(true);
      dbService.findOne = jest.fn().mockResolvedValue({ id, ...body });

      await service.update(id, body);

      expect(dbService.update).toHaveBeenCalledWith(id, body);
    });

    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      const body = new LocationUpdateDto();
      dbService.update = jest.fn().mockResolvedValue(true);
      dbService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, body)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(dbService.update).toHaveBeenCalledWith(id, body);
    });
    it('should throw BadRequestException if location is a child of the parent', async () => {
      const id = 1;
      const body = new LocationUpdateDto();
      body.parentId = 2;
      dbService.isChildOf = jest.fn().mockResolvedValue(true);

      await expect(service.update(id, body)).rejects.toThrow(
        new BadRequestException('Es sind keine Kreise erlaubt.'),
      );

      expect(dbService.isChildOf).toHaveBeenCalledWith(id, body.parentId);
    });
  });
});
