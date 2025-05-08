import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import { LocationCreateDto } from './dto/location-create.dto';
import { LocationDto } from './dto/location.dto';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LocationDbService } from './location-db.service';

describe('LocationService', () => {
  let service: LocationService;
  let locationService: LocationDbService;

  beforeEach(async () => {
    locationService = {} as LocationDbService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: LocationDbService,
          useValue: locationService,
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
      locationService.findAll = jest.fn().mockResolvedValue([]);

      expect(await service.findAll(offset, limit)).toEqual([]);

      expect(locationService.findAll).toHaveBeenCalledWith(offset, limit);
    });
    it('should call findAll with no parameters', async () => {
      locationService.findAll = jest.fn().mockResolvedValue([]);

      expect(await service.findAll()).toEqual([]);

      expect(locationService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const id = 1;
      const location = new LocationDto();
      locationService.findOne = jest.fn().mockResolvedValue(location);

      expect(await service.findOne(id)).toEqual(location);

      expect(locationService.findOne).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      locationService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(locationService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should call delete with correct parameters', async () => {
      const id = 1;
      locationService.delete = jest.fn().mockResolvedValue(true);

      await service.delete(id);

      expect(locationService.delete).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      locationService.delete = jest.fn().mockResolvedValue(false);

      await expect(service.delete(id)).rejects.toThrow(new NotFoundException());

      expect(locationService.delete).toHaveBeenCalledWith(id);
    });
  });

  it('getCount', async () => {
    const count = 5;
    locationService.getCount = jest.fn().mockResolvedValue(count);

    expect(await service.getCount()).toEqual({ count });

    expect(locationService.getCount).toHaveBeenCalled();
  });

  describe('create', () => {
    it('should call create with correct parameters', async () => {
      const body = new LocationCreateDto();
      const createdLocation = { id: 1, ...body };
      locationService.create = jest.fn().mockResolvedValue(createdLocation);
      locationService.findOne = jest.fn().mockResolvedValue(createdLocation);

      expect(await service.create(body)).toEqual(createdLocation);

      expect(locationService.create).toHaveBeenCalledWith(body);
    });

    it('should throw InternalServerErrorException if location not found', async () => {
      const body = new LocationCreateDto();
      locationService.create = jest.fn().mockResolvedValue({ id: 1 });
      locationService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.create(body)).rejects.toThrow(
        new InternalServerErrorException(),
      );

      expect(locationService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('update', () => {
    it('should call update with correct parameters', async () => {
      const id = 1;
      const body = new LocationCreateDto();
      locationService.update = jest.fn().mockResolvedValue(true);
      locationService.findOne = jest.fn().mockResolvedValue({ id, ...body });

      await service.update(id, body);

      expect(locationService.update).toHaveBeenCalledWith(id, body);
    });

    it('should throw NotFoundException if location not found', async () => {
      const id = 1;
      const body = new LocationCreateDto();
      locationService.update = jest.fn().mockResolvedValue(true);
      locationService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, body)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(locationService.update).toHaveBeenCalledWith(id, body);
    });
    it('should throw BadRequestException if location is a child of the parent', async () => {
      const id = 1;
      const body = new LocationCreateDto();
      body.parentId = 2;
      locationService.isChildOf = jest.fn().mockResolvedValue(true);

      await expect(service.update(id, body)).rejects.toThrow(
        new BadRequestException('Es sind keine Kreise erlaubt.'),
      );

      expect(locationService.isChildOf).toHaveBeenCalledWith(id, body.parentId);
    });
  });
});
