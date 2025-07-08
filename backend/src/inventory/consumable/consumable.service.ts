import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { CountDto } from '../../shared/dto/count.dto';
import { LocationEntity } from '../../base/location/location.entity';
import { ConsumableEntity } from './consumable.entity';
import { ConsumableDbService } from './consumable-db.service';
import { ConsumableDto } from './dto/consumable.dto';
import { ConsumableCreateDto } from './dto/consumable-create.dto';
import { ConsumableUpdateDto } from './dto/consumable-update.dto';
import { ConsumableLocationAddDto } from './dto/consumable-location-add.dto';
import { LocationDbService } from '../../base/location/location-db.service';
import { ConsumableLocationUpdateDto } from './dto/consumable-location-update.dto';

@Injectable()
export class ConsumableService {
  constructor(
    private readonly dbService: ConsumableDbService,
    private readonly locationDbService: LocationDbService,
  ) {}

  public async findAll(
    offset?: number,
    limit?: number,
    groupId?: number,
    locationIds?: number[],
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    const entities = await this.dbService.findAll(
      offset,
      limit,
      groupId,
      locationIds,
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

  public async addLocation(id: number, body: ConsumableLocationAddDto) {
    // Check if consumable exists
    const consumable = await this.dbService.findOne(id);
    if (!consumable) {
      throw new NotFoundException('Consumable not found');
    }

    // Check if location exists
    const location = await this.locationDbService.findOne(body.locationId);
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Add the location to the consumable
    await this.dbService.addLocation(id, body);

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async removeLocation(id: number, relationId: number) {
    if (!(await this.dbService.removeLocation(id, relationId))) {
      throw new NotFoundException();
    }
    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async updateLocation(
    id: number,
    relationId: number,
    data: ConsumableLocationUpdateDto,
  ) {
    // Check if relation exists
    const relation = await this.dbService.findLocationRelation(id, relationId);
    if (!relation) {
      throw new NotFoundException('Relation not found');
    }

    // Check if consumable exists
    const consumable = await this.dbService.findOne(id);
    if (!consumable) {
      throw new NotFoundException('Consumable not found');
    }

    // Check if location exists
    const location = await this.locationDbService.findOne(data.locationId);
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Update the location relation
    if (!(await this.dbService.updateLocation(id, relationId, data))) {
      throw new BadRequestException('Failed to update location relation');
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }
}
