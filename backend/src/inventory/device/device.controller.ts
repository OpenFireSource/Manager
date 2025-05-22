import { Body, Controller, Param, Query } from '@nestjs/common';
import {
  Endpoint,
  EndpointType,
} from '../../shared/decorator/endpoint.decorator';
import { CountDto } from '../../shared/dto/count.dto';
import { Role } from '../../core/auth/role/role';
import { IdNumberDto } from '../../shared/dto/id.dto';
import { DeviceService } from './device.service';
import { DeviceDto } from './dto/device.dto';
import { DeviceGetQueryDto } from './dto/device-get-query.dto';
import { DeviceUpdateDto } from './dto/device-update.dto';
import { DeviceCreateDto } from './dto/device-create.dto';
import { PaginationDto } from '../../shared/dto/pagination.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Endpoint(EndpointType.GET, {
    path: 'count',
    description: 'Gibt die Anzahl aller Geräte zurück',
    responseType: CountDto,
    roles: [Role.DeviceView],
  })
  public getCount(): Promise<CountDto> {
    return this.service.getCount();
  }

  @Endpoint(EndpointType.GET, {
    path: '',
    description: 'Gibt alle Geräte zurück',
    responseType: [DeviceDto],
    roles: [Role.DeviceView],
  })
  public async getAll(
    @Query() pagination: PaginationDto,
    @Query() querys: DeviceGetQueryDto,
  ): Promise<DeviceDto[]> {
    return this.service.findAll(
      pagination.offset,
      pagination.limit,
      querys.typeId,
      querys.groupId,
      querys.locationId,
      querys.sortCol,
      querys.sortDir,
    );
  }

  @Endpoint(EndpointType.GET, {
    path: ':id',
    description: 'Gibt eine Geräte zurück',
    responseType: DeviceDto,
    notFound: true,
    roles: [Role.DeviceView],
  })
  public getOne(@Param() params: IdNumberDto): Promise<DeviceDto> {
    return this.service.findOne(params.id);
  }

  @Endpoint(EndpointType.POST, {
    description: 'Erstellt eine Geräte',
    responseType: DeviceDto,
    notFound: true,
    roles: [Role.DeviceManage],
  })
  public create(@Body() body: DeviceCreateDto): Promise<DeviceDto> {
    return this.service.create(body);
  }

  @Endpoint(EndpointType.PUT, {
    path: ':id',
    description: 'Aktualisiert eine Geräte',
    notFound: true,
    responseType: DeviceDto,
    roles: [Role.DeviceManage],
  })
  public update(
    @Param() params: IdNumberDto,
    @Body() body: DeviceUpdateDto,
  ): Promise<DeviceDto> {
    return this.service.update(params.id, body);
  }

  @Endpoint(EndpointType.DELETE, {
    path: ':id',
    description: 'Löscht eine Geräte',
    noContent: true,
    notFound: true,
    roles: [Role.DeviceManage],
  })
  public async delete(@Param() params: IdNumberDto): Promise<void> {
    await this.service.delete(params.id);
  }
}
