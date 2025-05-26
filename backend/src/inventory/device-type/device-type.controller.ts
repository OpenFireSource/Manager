import { Body, Controller, Param, Query } from '@nestjs/common';
import { DeviceTypeService } from './device-type.service';
import { Role } from '../../core/auth/role/role';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { DeviceTypeDto } from './dto/device-type.dto';
import { DeviceTypeCreateDto } from './dto/device-type-create.dto';
import { DeviceTypeUpdateDto } from './dto/device-type-update.dto';
import { DeviceTypeGetQueryDto } from './dto/device-type-get-query.dto';
import { CountDto } from '../../shared/dto/count.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';
import { SearchDto } from '../../shared/dto/search.dto';

@Controller('device-type')
export class DeviceTypeController {
  constructor(private readonly service: DeviceTypeService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Device-Typen zurück',
    responseType: CountDto,
    roles: [Role.DeviceTypeView],
  })
  public getCount(@Query() search: SearchDto): Promise<CountDto> {
    return this.service.getCount(search.searchTerm);
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Device-Typen zurück',
    responseType: [DeviceTypeDto],
    roles: [Role.DeviceTypeView],
  })
  public async getAll(
    @Query() pagination: PaginationDto,
    @Query() querys: DeviceTypeGetQueryDto,
    @Query() search: SearchDto,
  ): Promise<DeviceTypeDto[]> {
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
    description: 'Gibt einen Device-Typen zurück',
    responseType: DeviceTypeDto,
    notFound: true,
    roles: [Role.DeviceTypeView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<DeviceTypeDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt einen Device-Typen',
    responseType: DeviceTypeDto,
    notFound: true,
    roles: [Role.DeviceTypeManage],
  })
  public create(@Body() body: DeviceTypeCreateDto): Promise<DeviceTypeDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert einen  Device-Typen',
    notFound: true,
    responseType: DeviceTypeDto,
    roles: [Role.DeviceTypeManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: DeviceTypeUpdateDto,
  ): Promise<DeviceTypeDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht einen Device-Typen',
    noContent: true,
    notFound: true,
    roles: [Role.DeviceTypeManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }
}
