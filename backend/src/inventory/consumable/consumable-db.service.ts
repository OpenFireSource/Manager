import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ConsumableEntity } from './consumable.entity';
import { ConsumableLocationEntity } from './consumable-location.entity';

@Injectable()
export class ConsumableDbService {
  constructor(
    @InjectRepository(ConsumableEntity)
    private readonly repo: Repository<ConsumableEntity>,
    @InjectRepository(ConsumableLocationEntity)
    private readonly clRepo: Repository<ConsumableLocationEntity>,
  ) {}

  private searchQueryBuilder(
    query: SelectQueryBuilder<ConsumableEntity>,
    searchTerm: string,
  ): SelectQueryBuilder<ConsumableEntity> {
    return query.where('c.name ilike :searchTerm', {
      searchTerm: `%${searchTerm}%`,
    });
  }

  public async getCount(searchTerm?: string) {
    let query = this.repo.createQueryBuilder('c');
    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }
    return query.getCount();
  }

  public async findAll(
    offset?: number,
    limit?: number,
    groupId?: number,
    locationIds?: number[],
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    let query = this.repo
      .createQueryBuilder('c')
      .limit(limit ?? 100)
      .offset(offset ?? 0)
      .leftJoinAndSelect('c.group', 'cg')
      .leftJoinAndSelect('c.consumableLocations', 'cl')
      .leftJoinAndSelect('cl.location', 'l')
      .leftJoinAndSelect('l.parent', 'lp');

    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }

    if (groupId) {
      query = query.andWhere('c.groupId = :groupId', { groupId });
    }

    if (locationIds && locationIds.length > 0) {
      query = query.andWhere('l.id IN (:...locationIds)', { locationIds });
    }

    if (sortCol) {
      query = query.orderBy(`c.${sortCol}`, sortDir ?? 'ASC');
    } else {
      query = query.orderBy('c.name');
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .leftJoinAndSelect('c.group', 'cg')
      .leftJoinAndSelect('c.consumableLocations', 'cl')
      .leftJoinAndSelect('cl.location', 'l')
      .leftJoinAndSelect('l.parent', 'lp');

    return query.getOne();
  }

  public async create(entity: DeepPartial<ConsumableEntity>) {
    return this.repo.save(entity);
  }

  public async update(id: number, data: DeepPartial<ConsumableEntity>) {
    const result = await this.repo.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  public async addLocation(
    id: number,
    body: DeepPartial<ConsumableLocationEntity>,
  ) {
    await this.clRepo.save({ ...body, consumableId: id });
  }

  public async removeLocation(consumableId: number, relationId: number) {
    const result = await this.clRepo
      .createQueryBuilder()
      .where('id = :id', { id: relationId })
      .andWhere('consumableId = :consumableId', { consumableId })
      .delete()
      .execute();
    return result.affected && result.affected !== 0;
  }

  public async findLocationRelation(relationId: number, consumableId: number) {
    return await this.clRepo.findOneBy({ id: relationId, consumableId });
  }

  public async updateLocation(
    consumableId: number,
    relationId: number,
    data: DeepPartial<ConsumableLocationEntity>,
  ) {
    const result = await this.clRepo.update(
      { id: relationId, consumableId },
      data,
    );
    return (result.affected ?? 0) > 0;
  }
}
