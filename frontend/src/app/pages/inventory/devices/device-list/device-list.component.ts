import {Component, effect, Signal} from '@angular/core';
import {DevicesService} from '../devices.service';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NgForOf, NgIf} from '@angular/common';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {DeviceDto} from '@backend/model/deviceDto';
import {DeviceTypes} from '../device-types';

@Component({
  selector: 'ofs-device-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule, NzIconModule, NgIf],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.less'
})
export class DeviceListComponent {
  protected readonly DeviceTypes = DeviceTypes;

  entities: Signal<DeviceDto[]>;
  total: Signal<number>;
  entitiesLoading: Signal<boolean>;
  itemsPerPage: number;
  page: number;

  constructor(
    private readonly service: DevicesService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.entities = this.service.entities;
    this.total = this.service.total;
    this.entitiesLoading = this.service.entitiesLoading;
    this.itemsPerPage = this.service.itemsPerPage;
    this.page = this.service.page;

    effect(() => {
      const error = this.service.entitiesLoadError();
      if (error) {
        this.inAppMessagingService.showError('Fehler beim laden der Geräte.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex, sort} = params;
    const sortCol = sort.find(x => x.value);
    this.service.updatePage(pageIndex, pageSize, sortCol?.key, sortCol?.value === 'ascend' ? 'ASC' : 'DESC');
  }

}
