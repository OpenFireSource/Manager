import {
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

@Injectable()
export class ConsumableService {
  constructor(
    private readonly dbService: ConsumableDbService,
    @InjectRepository(ConsumableEntity)
    private readonly repo: Repository<ConsumableEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,
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
    // Extract locationIds from the body
    const { locationIds, ...consumableData } = body;
    
    // Create the consumable entity first
    const newEntity = await this.dbService.create(consumableData);
    
    // Handle location associations if provided
    if (locationIds && locationIds.length > 0) {
      const locations = await this.locationRepo.findByIds(locationIds);
      if (locations.length > 0) {
        await this.repo
          .createQueryBuilder()
          .relation(ConsumableEntity, 'locations')
          .of(newEntity.id)
          .add(locations.map(l => l.id));
      }
    }
    
    const entity = await this.dbService.findOne(newEntity.id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async update(id: number, body: ConsumableUpdateDto) {
    // Extract locationIds from the body
    const { locationIds, ...consumableData } = body;
    
    // Update the consumable entity first
    if (!(await this.dbService.update(id, consumableData))) {
      throw new NotFoundException();
    }

    // Handle location associations if provided
    if (locationIds !== undefined) {
      // First, remove all existing location associations
      await this.repo
        .createQueryBuilder()
        .relation(ConsumableEntity, 'locations')
        .of(id)
        .remove(await this.repo
          .createQueryBuilder('c')
          .relation('locations')
          .of(id)
          .loadMany()
        );
      
      // Then add new associations if any
      if (locationIds.length > 0) {
        const locations = await this.locationRepo.findByIds(locationIds);
        if (locations.length > 0) {
          await this.repo
            .createQueryBuilder()
            .relation(ConsumableEntity, 'locations')
            .of(id)
            .add(locations.map(l => l.id));
        }
      }
    }

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new NotFoundException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async addLocation(id: number, locationId: number) {
    // Check if consumable exists
    const consumable = await this.dbService.findOne(id);
    if (!consumable) {
      throw new NotFoundException('Consumable not found');
    }

    // Check if location exists
    const location = await this.locationRepo.findOne({ where: { id: locationId } });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    // Add the location to the consumable
    await this.repo
      .createQueryBuilder()
      .relation(ConsumableEntity, 'locations')
      .of(id)
      .add(locationId);

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }

  public async removeLocation(id: number, locationId: number) {
    // Check if consumable exists
    const consumable = await this.dbService.findOne(id);
    if (!consumable) {
      throw new NotFoundException('Consumable not found');
    }

    // Remove the location from the consumable
    await this.repo
      .createQueryBuilder()
      .relation(ConsumableEntity, 'locations')
      .of(id)
      .remove(locationId);

    const entity = await this.dbService.findOne(id);
    if (!entity) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(ConsumableDto, entity);
  }
}