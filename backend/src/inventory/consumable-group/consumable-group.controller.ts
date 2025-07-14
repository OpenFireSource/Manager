import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { CountDto } from '../../shared/dto/count.dto';
import { Role } from '../../core/auth/role/role';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { ConsumableGroupService } from './consumable-group.service';
import { ConsumableGroupDto } from './dto/consumable-group.dto';
import { ConsumableGroupUpdateDto } from './dto/consumable-group-update.dto';
import { ConsumableGroupCreateDto } from './dto/consumable-group-create.dto';
import { ConsumableGroupGetQueryDto } from './dto/consumable-group-get-query.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { SearchDto } from '../../shared/dto/search.dto';

@Controller('consumable-group')
export class ConsumableGroupController {
  constructor(private readonly service: ConsumableGroupService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Verbrauchsgüter-Gruppen zurück',
    responseType: CountDto,
    roles: [Role.ConsumableGroupView],
  })
  public getCount(@Query() search: SearchDto): Promise<CountDto> {
    return this.service.getCount(search.searchTerm);
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Verbrauchsgüter-Gruppen zurück',
    responseType: [ConsumableGroupDto],
    roles: [Role.ConsumableGroupView],
  })
  public async getAll(
    @Query() pagination: PaginationDto,
    @Query() querys: ConsumableGroupGetQueryDto,
    @Query() search: SearchDto,
  ): Promise<ConsumableGroupDto[]> {
    return this.service.findAll(
      pagination.offset,
      pagination.limit,
      querys.sortCol,
      querys.sortDir,
      search.searchTerm,
    );
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt eine Verbrauchsgüter-Gruppe zurück',
    responseType: ConsumableGroupDto,
    notFound: true,
    roles: [Role.ConsumableGroupView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<ConsumableGroupDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt eine Verbrauchsgüter-Gruppe',
    responseType: ConsumableGroupDto,
    notFound: true,
    roles: [Role.ConsumableGroupManage],
  })
  public create(
    @Body() body: ConsumableGroupCreateDto,
  ): Promise<ConsumableGroupDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert eine Verbrauchsgüter-Gruppe',
    notFound: true,
    responseType: ConsumableGroupDto,
    roles: [Role.ConsumableGroupManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: ConsumableGroupUpdateDto,
  ): Promise<ConsumableGroupDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht eine Verbrauchsgüter-Gruppe',
    noContent: true,
    notFound: true,
    roles: [Role.ConsumableGroupManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }
}
