import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { ConsumableGroupDbService } from './consumable-group-db.service';
import { ConsumableGroupDto } from './dto/consumable-group.dto';
import { ConsumableGroupCreateDto } from './dto/consumable-group-create.dto';
import { ConsumableGroupUpdateDto } from './dto/consumable-group-update.dto';

@Injectable()
export class ConsumableGroupService {
  constructor(private readonly dbService: ConsumableGroupDbService) {}

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
    return plainToInstance(ConsumableGroupDto, entities);
  }

  public async findOne(id: number) {
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(ConsumableGroupDto, entity);
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

  public async create(body: ConsumableGroupCreateDto) {
    const newEntity = await this.dbService.create(body);
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableGroupDto, entity);
  }

  public async update(id: number, body: ConsumableGroupUpdateDto) {
    if (!(await this.dbService.update(id, body))) {
      throw new NotFoundException();
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(ConsumableGroupDto, entity);
  }
}