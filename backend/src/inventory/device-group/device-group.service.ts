import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { DeviceGroupDbService } from './device-group-db.service';
import { DeviceGroupDto } from './dto/device-group.dto';
import { DeviceGroupCreateDto } from './dto/device-group-create.dto';
import { DeviceGroupUpdateDto } from './dto/device-group-update.dto';

@Injectable()
export class DeviceGroupService {
  constructor(private readonly dbService: DeviceGroupDbService) {}

  public async findAll(
    offset?: number,
    limit?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
  ) {
    const entities = await this.dbService.findAll(
      offset,
      limit,
      sortCol,
      sortDir,
    );
    return plainToInstance(DeviceGroupDto, entities);
  }

  public async findOne(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceGroupDto, entity);
  }

  public async delete(id: number) {
    if (!(await this.dbService.delete(id))) {
      throw new NotFoundException();
    }
  }

  public async getCount() {
    const count = await this.dbService.getCount();
    return plainToInstance(CountDto, { count });
  }

  public async create(body: DeviceGroupCreateDto) {
    const newEntity = await this.dbService.create(body);
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(DeviceGroupDto, entity);
  }

  public async update(id: number, body: DeviceGroupUpdateDto) {
    if (!(await this.dbService.update(id, body))) {
      throw new NotFoundException();
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(DeviceGroupDto, entity);
  }
}
