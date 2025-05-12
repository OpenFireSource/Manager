import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { DeviceDbService } from './device-db.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeviceCreateDto } from './dto/device-create.dto';
import { DeviceEntity } from './device.entity';
import { DeviceUpdateDto } from './dto/device-update.dto';

describe('DeviceService', () => {
  let service: DeviceService;
  let dbService: DeviceDbService;

  beforeEach(async () => {
    dbService = {} as DeviceDbService;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: DeviceDbService,
          useValue: dbService,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      expect(dbService.findAll).toHaveBeenCalledWith(
        offset,
        limit,
        undefined,
        undefined,
      );
    });
    it('should call findAll with no parameters', async () => {
      dbService.findAll = jest.fn().mockResolvedValue([]);

      expect(await service.findAll()).toEqual([]);

      expect(dbService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should call findOne with correct parameters', async () => {
      const id = 1;
      const entity = new DeviceEntity();
      dbService.findOne = jest.fn().mockResolvedValue(entity);

      expect(await service.findOne(id)).toEqual(entity);

      expect(dbService.findOne).toHaveBeenCalledWith(id);
    });
    it('should throw NotFoundException', async () => {
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
    it('should throw NotFoundException', async () => {
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
      const body = new DeviceCreateDto();
      const createdDevice = { id: 1, ...body };
      dbService.create = jest.fn().mockResolvedValue(createdDevice);
      dbService.findOne = jest.fn().mockResolvedValue(createdDevice);

      expect(await service.create(body)).toEqual(createdDevice);

      expect(dbService.create).toHaveBeenCalledWith(body);
    });

    it('should throw InternalServerErrorException', async () => {
      const body = new DeviceCreateDto();
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
      const body = new DeviceUpdateDto();
      dbService.update = jest.fn().mockResolvedValue(true);
      dbService.findOne = jest.fn().mockResolvedValue({ id, ...body });

      expect(await service.update(id, body)).toEqual({ id, ...body });

      expect(dbService.update).toHaveBeenCalledWith(id, body);
    });

    it('should throw NotFoundException #1', async () => {
      const id = 1;
      const body = new DeviceUpdateDto();
      dbService.update = jest.fn().mockResolvedValue(true);
      dbService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.update(id, body)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(dbService.update).toHaveBeenCalledWith(id, body);
    });

    it('should throw NotFoundException #2', async () => {
      const id = 1;
      const body = new DeviceUpdateDto();
      dbService.update = jest.fn().mockResolvedValue(false);

      await expect(service.update(id, body)).rejects.toThrow(
        new NotFoundException(),
      );

      expect(dbService.update).toHaveBeenCalledWith(id, body);
    });
  });
});
