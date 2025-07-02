import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { ConsumableDbService } from './consumable-db.service';
import { ConsumableDto } from './dto/consumable.dto';
import { ConsumableCreateDto } from './dto/consumable-create.dto';
import { ConsumableUpdateDto } from './dto/consumable-update.dto';

@Injectable()
export class ConsumableService {
  constructor(private readonly dbService: ConsumableDbService) {}

  public async findAll(
    offset?: number,
    limit?: number,
    groupId?: number,
    locationId?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    const entities = await this.dbService.findAll(
      offset,
      limit,
      groupId,
      locationId,
      sortCol,
      sortDir,
      searchTerm,
    );
    return plainToInstance(ConsumableDto, entities);
  }

  public async findOne(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(ConsumableDto, entity);
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

  public async create(body: ConsumableCreateDto) {
    const newEntity = await this.dbService.create(body);
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async update(id: number, body: ConsumableUpdateDto) {
    if (!(await this.dbService.update(id, body))) {
      throw new NotFoundException();
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(ConsumableDto, entity);
  }
}