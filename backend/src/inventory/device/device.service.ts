import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { DeviceDbService } from './device-db.service';
import { DeviceDto } from './dto/device.dto';
import { DeviceUpdateDto } from './dto/device-update.dto';
import { DeviceCreateDto } from './dto/device-create.dto';
import { v4 } from 'uuid';
import { MinioService } from '../../core/services/storage/minio.service';
import { UploadUrlDto } from '../../shared/dto/upload-url.dto';

@Injectable()
export class DeviceService {
  constructor(
    private readonly dbService: DeviceDbService,
    private readonly minioService: MinioService,
  ) {}

  public async findAll(
    offset?: number,
    limit?: number,
    typeId?: number,
    groupId?: number,
    locationId?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    const entities = await this.dbService.findAll(
      offset,
      limit,
      typeId,
      groupId,
      locationId,
      sortCol,
      sortDir,
      searchTerm,
    );
    return plainToInstance(DeviceDto, entities);
  }

  public async findOne(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceDto, entity);
  }

  public async delete(id: number) {
    if (!(await this.dbService.delete(id))) {
      throw new NotFoundException();
    }
  }

  public async getCount(searchTerm?: string) {
    const count = await this.dbService.getCount(searchTerm);
    return plainToInstance(CountDto, { count });
  }

  public async create(body: DeviceCreateDto) {
    const newEntity = await this.dbService.create(body);
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(DeviceDto, entity);
  }

  public async update(id: number, body: DeviceUpdateDto) {
    if (!(await this.dbService.update(id, body))) {
      throw new NotFoundException();
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceDto, entity);
  }

  public async getImageUploadUrl(id: number, contentType: string) {
    const device = await this.dbService.findOne(id);
    if (!device) {
      throw new NotFoundException();
    }

    if (!this.minioService.checkImageTypes(contentType)) {
      throw new BadRequestException('Invalid file extension');
    }

    const uuid = v4();
    const minioPath = `devices/${device.id}/images/${uuid}`;

    const url = await this.minioService.generatePresignedPostUrl(
      minioPath,
      contentType,
      50, // 50 MB
    );
    return plainToInstance(UploadUrlDto, url, {
      excludeExtraneousValues: true,
    });
  }

  async addImage(deviceId: number, imageId: string) {
    if (!Number.isInteger(deviceId)) {
      throw new Error('deviceId must be an integer');
    }

    const device = await this.dbService.findOne(deviceId);

    if (!device) {
      throw new NotFoundException();
    }

    await this.dbService.addImage(device, imageId);
  }
}
