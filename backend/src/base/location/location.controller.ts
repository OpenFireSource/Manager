import { Body, Controller, Param, Query } from '@nestjs/common';
import { LocationService } from './location.service';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { LocationDto } from './dto/location.dto';
import { Role } from '../../core/auth/role/role';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { CountDto } from '../../shared/dto/count.dto';
import { LocationGetQueryDto } from './dto/location-get-query.dto';
import { LocationCreateDto } from './dto/location-create.dto';
import { LocationUpdateDto } from './dto/location-update.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly service: LocationService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Standorte zurück',
    responseType: CountDto,
    roles: [Role.LocationView],
  })
  public getCount(): Promise<CountDto> {
    return this.service.getCount();
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Standorte zurück',
    responseType: [LocationDto],
    roles: [Role.LocationView],
  })
  public async getAll(
    @Query() pagination: PaginationDto,
    @Query() querys: LocationGetQueryDto,
  ): Promise<LocationDto[]> {
    return this.service.findAll(
      pagination.offset,
      pagination.limit,
      querys.sortCol,
      querys.sortDir,
    );
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt einen Standort zurück',
    responseType: LocationDto,
    notFound: true,
    roles: [Role.LocationView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<LocationDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt einen Standort',
    responseType: LocationDto,
    notFound: true,
    roles: [Role.LocationManage],
  })
  public create(@Body() body: LocationCreateDto): Promise<LocationDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert einen  Standort',
    notFound: true,
    responseType: LocationDto,
    roles: [Role.LocationManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: LocationUpdateDto,
  ): Promise<LocationDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht einen Standort',
    noContent: true,
    notFound: true,
    roles: [Role.LocationManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }

  // TODO get parent, get children (depth 2)
}
