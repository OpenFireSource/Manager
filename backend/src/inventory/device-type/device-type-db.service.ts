import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceTypeEntity } from './device-type.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class DeviceTypeDbService {
  constructor(
    @InjectRepository(DeviceTypeEntity)
    private readonly repo: Repository<DeviceTypeEntity>,
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
      .createQueryBuilder('dt')
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    if (sortCol) {
      query = query.orderBy(`dt.${sortCol}`, sortDir ?? 'ASC');
    } else {
      query = query.orderBy('dt.name');
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('dt')
      .where('dt.id = :id', { id });

    return query.getOne();
  }

  public async create(entity: DeepPartial<DeviceTypeEntity>) {
    return this.repo.save(entity);
  }

  public async update(id: number, data: DeepPartial<DeviceTypeEntity>) {
    const result = await this.repo.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
