import {Component, effect, Signal} from '@angular/core';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NgForOf, NgIf} from '@angular/common';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceTypesService} from '../device-types.service';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';

@Component({
  selector: 'ofs-device-type-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule, NzIconModule, NgIf],
  standalone: true,
  templateUrl: './device-type-list.component.html',
  styleUrl: './device-type-list.component.less'
})
export class DeviceTypeListComponent {
  entities: Signal<DeviceTypeDto[]>;
  total: Signal<number>;
  entitiesLoading: Signal<boolean>;
  itemsPerPage: number;
  page: number;

  constructor(
    private readonly service: DeviceTypesService,
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
        this.inAppMessagingService.showError('Fehler beim laden der Geräte-Typen.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex} = params;
    this.service.updatePage(pageIndex, pageSize);
  }
}
