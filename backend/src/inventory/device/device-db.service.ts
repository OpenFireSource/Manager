import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { DeviceEntity } from './device.entity';
import { DeviceImageEntity } from './device-image.entity';

@Injectable()
export class DeviceDbService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly repo: Repository<DeviceEntity>,
    @InjectRepository(DeviceImageEntity)
    private readonly imageRepo: Repository<DeviceImageEntity>,
  ) {}

  private searchQueryBuilder(
    query: SelectQueryBuilder<DeviceEntity>,
    searchTerm: string,
  ): SelectQueryBuilder<DeviceEntity> {
    return query.where('d.name ilike :searchTerm', {
      searchTerm: `%${searchTerm}%`,
    });
  }

  public async getCount(searchTerm?: string) {
    let query = this.repo.createQueryBuilder('d');
    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }
    return query.getCount();
  }

  public async findAll(
    offset?: number,
    limit?: number,
    typeId?: number,
    groupId?: number,
    locationId?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    let query = this.repo
      .createQueryBuilder('d')
      .limit(limit ?? 100)
      .offset(offset ?? 0)
      .leftJoinAndSelect('d.type', 'dt')
      .leftJoinAndSelect('d.group', 'dg')
      .leftJoinAndSelect('d.location', 'l')
      .leftJoinAndSelect('l.parent', 'lp')
      .leftJoinAndSelect('d.defaultImage', 'di');

    if (searchTerm) {
      query = this.searchQueryBuilder(query, searchTerm);
    }

    if (sortCol) {
      if (sortCol.startsWith('type.')) {
        query = query.orderBy(
          `dt.${sortCol.replaceAll('type.', '')}`,
          sortDir ?? 'ASC',
        );
      } else if (sortCol.startsWith('group.')) {
        query = query.orderBy(
          `dg.${sortCol.replaceAll('group.', '')}`,
          sortDir ?? 'ASC',
        );
      } else if (sortCol.startsWith('location.')) {
        query = query.orderBy(
          `l.${sortCol.replaceAll('location.', '')}`,
          sortDir ?? 'ASC',
        );
      } else {
        query = query.orderBy(`d.${sortCol}`, sortDir ?? 'ASC');
      }
    } else {
      query = query.orderBy('d.name');
    }

    if (typeId) {
      query = query.where('d.typeId = :typeId', { typeId });
    }
    if (groupId) {
      query = query.where('d.groupId = :groupId', { groupId });
    }
    if (locationId) {
      query = query.where('d.locationId = :locationId', { locationId });
    }

    return query.getMany();
  }

  public findOne(id: number) {
    const query = this.repo
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.type', 'dt')
      .leftJoinAndSelect('d.group', 'dg')
      .leftJoinAndSelect('d.location', 'l')
      .leftJoinAndSelect('l.parent', 'lp')
      .leftJoinAndSelect('d.images', 'i')
      .leftJoinAndSelect('d.defaultImage', 'di')
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

  public async addImage(device: DeviceEntity, imageId: string) {
    await this.imageRepo.save({ device, id: imageId });
  }

  public async findImage(deviceId: number, imageId: string) {
    return this.imageRepo.findOneBy({ deviceId, id: imageId });
  }

  async deleteImage(id: number, imageId: string) {
    const result = await this.imageRepo.delete({ deviceId: id, id: imageId });
    return (result.affected ?? 0) > 0;
  }
}
