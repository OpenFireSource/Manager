import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeviceTypeDbService } from './device-type-db.service';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { DeviceTypeCreateDto } from './dto/device-type-create.dto';
import { DeviceTypeUpdateDto } from './dto/device-type-update.dto';
import { DeviceTypeDto } from './dto/device-type.dto';

@Injectable()
export class DeviceTypeService {
  constructor(private readonly dbService: DeviceTypeDbService) {}

  public async findAll(
    offset?: number,
    limit?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    const entities = await this.dbService.findAll(
      offset,
      limit,
      sortCol,
      sortDir,
      searchTerm,
    );
    return plainToInstance(DeviceTypeDto, entities);
  }

  public async findOne(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceTypeDto, entity);
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

  public async create(body: DeviceTypeCreateDto) {
    const newEntity = await this.dbService.create(body);
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(DeviceTypeDto, entity);
  }

  public async update(id: number, body: DeviceTypeUpdateDto) {
    if (!(await this.dbService.update(id, body))) {
      throw new NotFoundException();
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceTypeDto, entity);
  }
}
