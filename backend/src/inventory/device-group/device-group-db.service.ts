import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { DeviceGroupEntity } from './device-group.entity';

@Injectable()
export class DeviceGroupDbService {
  constructor(
    @InjectRepository(DeviceGroupEntity)
    private readonly repo: Repository<DeviceGroupEntity>,
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
      .createQueryBuilder('dg')
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    if (sortCol) {
      query = query.orderBy(`dg.${sortCol}`, sortDir ?? 'ASC');
    } else {
      query = query.orderBy('dg.name');
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('dg')
      .where('dg.id = :id', { id });

    return query.getOne();
  }

  public async create(entity: DeepPartial<DeviceGroupEntity>) {
    return this.repo.save(entity);
  }

  public async update(id: number, data: DeepPartial<DeviceGroupEntity>) {
    const result = await this.repo.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
