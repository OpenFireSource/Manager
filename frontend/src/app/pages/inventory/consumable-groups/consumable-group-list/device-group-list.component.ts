import {Component, effect, Signal} from '@angular/core';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {
  NzTableModule,
  NzTableQueryParams,
} from 'ng-zorro-antd/table';
import {DeviceGroupsService} from '../device-groups.service';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NgForOf} from '@angular/common';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {RouterLink} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';

@Component({
  selector: 'ofs-device-group-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule, NzIconModule],
  templateUrl: './device-group-list.component.html',
  styleUrl: './device-group-list.component.less'
})
export class DeviceGroupListComponent {
  entities: Signal<DeviceGroupDto[]>;
  total: Signal<number>;
  entitiesLoading: Signal<boolean>;
  itemsPerPage: number;
  page: number;

  constructor(
    private readonly service: DeviceGroupsService,
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
        this.inAppMessagingService.showError('Fehler beim laden der Geräte-Gruppen.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex, sort} = params;
    const sortCol = sort.find(x => x.value);
    this.service.updatePage(pageIndex, pageSize, sortCol?.key, sortCol?.value === 'ascend' ? 'ASC' : 'DESC');
  }
}
