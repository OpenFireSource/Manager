import {
  BadRequestException,
  forwardRef,
  Inject,
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
import { ImageService } from '../../core/services/storage/image.service';
import { DownloadUrlDto } from '../../shared/dto/download-url.dto';

@Injectable()
export class DeviceService {
  constructor(
    private readonly dbService: DeviceDbService,
    @Inject(forwardRef(() => MinioService))
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

    const imgs: { id: string; previewUrl: string }[] = [];
    const images = entity.images;
    for (const img of images) {
      const presignedUrl = await this.minioService.generatePresignedGetUrl(
        'devices/' + id + '/images/' + img.id + ImageService.previewSuffix,
      );
      imgs.push({
        id: img.id,
        previewUrl: presignedUrl,
      });
    }

    return plainToInstance(DeviceDto, { ...entity, images: imgs });
  }

  public async delete(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }

    if (entity.images && entity.images.length > 0) {
      await Promise.all(
        entity.images.map((img) => this.deleteImage(id, img.id)),
      );
    }

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

    return this.findOne(id);
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
    return plainToInstance(
      UploadUrlDto,
      { ...url, id: uuid },
      { excludeExtraneousValues: true },
    );
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

  async downloadImage(deviceId: number, imageId: string, size: string) {
    const image = await this.dbService.findImage(deviceId, imageId);
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    const url = await this.minioService.generatePresignedGetUrl(
      `devices/${deviceId}/images/${imageId}` + (size !== '' ? '-' + size : ''),
    );
    return plainToInstance(DownloadUrlDto, { url });
  }

  public async deleteImage(id: number, imageId: string) {
    if (!(await this.dbService.deleteImage(id, imageId))) {
      throw new NotFoundException('Image not found');
    }

    await this.minioService.deleteImages('devices', id, imageId);
  }
}
