import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { CountDto } from '../../shared/dto/count.dto';
import { Role } from '../../core/auth/role/role';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupDto } from './dto/device-group.dto';
import { DeviceGroupUpdateDto } from './dto/device-group-update.dto';
import { DeviceGroupCreateDto } from './dto/device-group-create.dto';
import { DeviceGroupGetQueryDto } from './dto/device-group-get-query.dto';

@Controller('device-group')
export class DeviceGroupController {
  constructor(private readonly service: DeviceGroupService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Geräte-Gruppen zurück',
    responseType: CountDto,
    roles: [Role.DeviceTypeView],
  })
  public getCount(): Promise<CountDto> {
    return this.service.getCount();
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Geräte-Gruppen zurück',
    responseType: [DeviceGroupDto],
    roles: [Role.DeviceTypeView],
  })
  public async getAll(
    @Query() querys: DeviceGroupGetQueryDto,
  ): Promise<DeviceGroupDto[]> {
    return this.service.findAll(querys.offset, querys.limit);
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt eine Geräte-Gruppe zurück',
    responseType: DeviceGroupDto,
    notFound: true,
    roles: [Role.DeviceTypeView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<DeviceGroupDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt eine Geräte-Gruppe',
    responseType: DeviceGroupDto,
    notFound: true,
    roles: [Role.DeviceTypeManage],
  })
  public create(@Body() body: DeviceGroupCreateDto): Promise<DeviceGroupDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert eine Geräte-Gruppen',
    notFound: true,
    responseType: DeviceGroupDto,
    roles: [Role.DeviceTypeManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: DeviceGroupUpdateDto,
  ): Promise<DeviceGroupDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht eine Geräte-Gruppe',
    noContent: true,
    notFound: true,
    roles: [Role.DeviceTypeManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }
}
