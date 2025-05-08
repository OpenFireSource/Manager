import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { DeviceEntity } from './device.entity';

@Injectable()
export class DeviceDbService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly repo: Repository<DeviceEntity>,
  ) {}

  public async getCount() {
    return this.repo.count();
  }

  public async findAll(offset?: number, limit?: number, typeId?: number) {
    let query = this.repo
      .createQueryBuilder('d')
      .limit(limit ?? 100)
      .offset(offset ?? 0);

    if (typeId) {
      query = query.where('d.typeId = :typeId', { typeId });
    } else {
      query = query.leftJoinAndSelect('d.type', 'dt');
    }

    return query.orderBy('d.name').getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.type', 'dt')
      .where('d.id = :id', { id });

    return query.getOne();
  }

  public async create(entity: DeepPartial<DeviceEntity>) {
    return this.repo.save(entity);
  }

  public async update(id: number, data: DeepPartial<DeviceEntity>) {
    const result = await this.repo.update(id, data);
    return (result.affected ?? 0) > 0;
  }

  public async delete(id: number) {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
