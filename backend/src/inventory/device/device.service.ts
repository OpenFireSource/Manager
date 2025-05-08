import {
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

@Injectable()
export class DeviceService {
  constructor(private readonly dbService: DeviceDbService) {}

  public async findAll(offset?: number, limit?: number, typeId?: number) {
    const entities = await this.dbService.findAll(offset, limit, typeId);
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

  public async getCount() {
    const count = await this.dbService.getCount();
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
}
