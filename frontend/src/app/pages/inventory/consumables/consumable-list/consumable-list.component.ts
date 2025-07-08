import {Component, effect, Signal} from '@angular/core';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {CommonModule} from '@angular/common';
import {ConsumablesService} from '../consumables.service';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {ConsumableDto} from '@backend/model/consumableDto';

@Component({
  selector: 'ofs-consumable-list',
  imports: [
    NzTableModule,
    CommonModule,
    HasRoleDirective,
    NzButtonComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './consumable-list.component.html',
  styleUrl: './consumable-list.component.less'
})
export class ConsumableListComponent {

  entities: Signal<ConsumableDto[]>;
  total: Signal<number>;
  entitiesLoading: Signal<boolean>;
  itemsPerPage: number;
  page: number;

  constructor(
    private readonly service: ConsumablesService,
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
