import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { LocationDbService } from './location-db.service';
import { plainToInstance } from 'class-transformer';
import { LocationDto } from './dto/location.dto';
import { LocationCreateDto } from './dto/location-create.dto';
import { LocationUpdateDto } from './dto/location-update.dto';
import { CountDto } from '../../shared/dto/count.dto';

@Injectable()
export class LocationService {
  constructor(private readonly dbService: LocationDbService) {}

  public async findAll(
    offset?: number,
    limit?: number,
    sortCol?: string,
    sortDir?: 'ASC' | 'DESC',
    searchTerm?: string,
  ) {
    const locations = await this.dbService.findAll(
      offset,
      limit,
      sortCol,
      sortDir,
      searchTerm,
    );
    return plainToInstance(LocationDto, locations);
  }

  public async findOne(id: number) {
    const location = await this.dbService.findOne(id);
    if (!location) {
      throw new NotFoundException();
    }
    return plainToInstance(LocationDto, location);
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

  public async create(body: LocationCreateDto) {
    const newEntity = await this.dbService.create(body);
    const location = await this.dbService.findOne(newEntity.id);
    if (!location) {
      throw new InternalServerErrorException();
    }
    return plainToInstance(LocationDto, location);
  }

  public async update(id: number, body: LocationUpdateDto) {
    if (body.parentId && (await this.dbService.isChildOf(id, body.parentId))) {
      throw new BadRequestException('Es sind keine Kreise erlaubt.');
    }

    await this.dbService.update(id, body);

    const location = await this.dbService.findOne(id);
    if (!location) {
      throw new NotFoundException();
    }
    return plainToInstance(LocationDto, location);
  }
}
