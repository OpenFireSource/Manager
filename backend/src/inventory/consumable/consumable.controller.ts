import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { CountDto } from '../../shared/dto/count.dto';
import { Role } from '../../core/auth/role/role';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { ConsumableService } from './consumable.service';
import { ConsumableDto } from './dto/consumable.dto';
import { ConsumableGetQueryDto } from './dto/consumable-get-query.dto';
import { ConsumableUpdateDto } from './dto/consumable-update.dto';
import { ConsumableCreateDto } from './dto/consumable-create.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { SearchDto } from '../../shared/dto/search.dto';
import { ConsumableLocationAddDto } from './dto/consumable-location-add.dto';
import { ConsumableLocationUpdateDto } from './dto/consumable-location-update.dto';

@Controller('consumable')
export class ConsumableController {
  constructor(private readonly service: ConsumableService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Verbrauchsgüter zurück',
    responseType: CountDto,
    roles: [Role.ConsumableView],
  })
  public getCount(@Query() search: SearchDto): Promise<CountDto> {
    return this.service.getCount(search.searchTerm);
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Verbrauchsgüter zurück',
    responseType: [ConsumableDto],
    roles: [Role.ConsumableView],
  })
  public async getAll(
    @Query() pagination: PaginationDto,
    @Query() querys: ConsumableGetQueryDto,
    @Query() search: SearchDto,
  ): Promise<ConsumableDto[]> {
    return this.service.findAll(
      pagination.offset,
      pagination.limit,
      querys.groupId,
      querys.locationIds,
      querys.sortCol,
      querys.sortDir,
      search.searchTerm,
    );
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt ein Verbrauchsgut zurück',
    responseType: ConsumableDto,
    notFound: true,
    roles: [Role.ConsumableView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<ConsumableDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt ein Verbrauchsgut',
    responseType: ConsumableDto,
    notFound: true,
    roles: [Role.ConsumableManage],
  })
  public create(@Body() body: ConsumableCreateDto): Promise<ConsumableDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert ein Verbrauchsgut',
    notFound: true,
    responseType: ConsumableDto,
    roles: [Role.ConsumableManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: ConsumableUpdateDto,
  ): Promise<ConsumableDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht ein Verbrauchsgut',
    noContent: true,
    notFound: true,
    roles: [Role.ConsumableManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }

  @Endpoint(EndpointType.POST, {
    path: ':id/locations',
    description: 'Fügt einem Verbrauchsgut einen Standort hinzu',
    responseType: ConsumableDto,
    notFound: true,
    roles: [Role.ConsumableManage],
  })
  public addLocation(
    @Param('id') id: number,
    @Body() body: ConsumableLocationAddDto,
  ): Promise<ConsumableDto> {
    return this.service.addLocation(id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id/locations/:relationId',
    description: 'Entfernt einen Standort von einem Verbrauchsgut',
    responseType: ConsumableDto,
    notFound: true,
    roles: [Role.ConsumableManage],
  })
  public removeLocation(
    @Param('id') id: number,
    @Param('relationId') relationId: number,
  ): Promise<ConsumableDto> {
    return this.service.removeLocation(id, relationId);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id/locations/:relationId',
    description:
      'Aktualisiert die Relation zwischen einem Verbrauchsgut und einen Standort.',
    responseType: ConsumableDto,
    notFound: true,
    roles: [Role.ConsumableManage],
  })
  public updateLocation(
    @Param('id') id: number,
    @Param('relationId') relationId: number,
    @Body() body: ConsumableLocationUpdateDto,
  ): Promise<ConsumableDto> {
    return this.service.updateLocation(id, relationId, body);
  }
}
