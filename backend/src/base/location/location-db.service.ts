import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { TreeRepository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class LocationDbService {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repo: TreeRepository<LocationEntity>,
  ) {}

  public async getCount() {
    return this.repo.count();
  }

  public async findAll(
    offset?: number,
    limit?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
  ) {
    let query = this.repo
      .createQueryBuilder('l')
      .leftJoinAndSelect('l.parent', 'p')
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    if (sortCol) {
      if (sortCol.startsWith('parent.')) {
        query = query.orderBy(
          `p.${sortCol.replaceAll('parent.', '')}`,
          sortDir ?? 'ASC',
        );
      } else {
        query = query.orderBy(`l.${sortCol}`, sortDir ?? 'ASC');
      }
    } else {
      query = query.orderBy('l.name');
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('l')
      .where('l.id = :id', { id })
      .leftJoinAndSelect('l.children', 'c')
      .leftJoinAndSelect('l.parent', 'p');

    return query.orderBy('c.name').getOne();
  }

  public async create(entity: DeepPartial<LocationEntity>) {
    return this.repo.save(entity);
  }

  public async isChildOf(id: number, parentId: number) {
    const parent = await this.repo.findOneBy({ id: parentId });
    if (parent === null) {
      return false;
    }
    const ancestors = await this.repo.findAncestors(parent);
    return ancestors.some((ancestor) => ancestor.id == id);
  }

  public async update(id: number, data: DeepPartial<LocationEntity>) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException();
    }
    if (data.parentId) {
      const parent = await this.repo.findOneBy({ id: data.parentId });
      if (!parent) {
        throw new NotFoundException();
      }
      entity.parent = parent;
    } else {
      entity.parent = null;
    }

    await this.repo.save({ ...entity, ...data });
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
