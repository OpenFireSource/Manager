import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { ConsumableGroupEntity } from './consumable-group.entity';

@Injectable()
export class ConsumableGroupDbService {
  constructor(
    @InjectRepository(ConsumableGroupEntity)
    private readonly repo: Repository<ConsumableGroupEntity>,
  ) {}

  private searchQueryBuilder(
    query: SelectQueryBuilder<ConsumableGroupEntity>,
    searchTerm: string,
  ): SelectQueryBuilder<ConsumableGroupEntity> {
    return query.where('cg.name ilike :searchTerm', {
      searchTerm: `%${searchTerm}%`,
    });
  }

  public async getCount(searchTerm?: string) {
    let query = this.repo.createQueryBuilder('cg');
    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }
    return query.getCount();
  }

  public async findAll(
    offset?: number,
    limit?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    let query = this.repo
      .createQueryBuilder('cg')
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }

    if (sortCol) {
      query = query.orderBy(`cg.${sortCol}`, sortDir ?? 'ASC');
    } else {
      query = query.orderBy('cg.name');
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('cg')
      .where('cg.id = :id', { id });

    return query.getOne();
  }

  public async create(entity: DeepPartial<ConsumableGroupEntity>) {
    return this.repo.save(entity);
  }

  public async update(id: number, data: DeepPartial<ConsumableGroupEntity>) {
    const result = await this.repo.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
