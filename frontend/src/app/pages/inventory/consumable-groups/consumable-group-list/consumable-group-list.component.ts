import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NzTableModule, NzTableQueryParams,
} from 'ng-zorro-antd/table';
import {ConsumableGroupsService} from '../consumable-groups.service';
import {HasRoleDirective} from "../../../../core/auth/has-role.directive";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'ofs-consumable-group-list',
  imports: [
    NzTableModule,
    CommonModule,
    HasRoleDirective,
    NzButtonComponent,
    RouterLink
  ],
  standalone: true,
  templateUrl: './consumable-group-list.component.html',
  styleUrl: './consumable-group-list.component.less'
})
export class ConsumableGroupListComponent {
  constructor(public service: ConsumableGroupsService) {}

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex, sort} = params;
    const sortCol = sort.find(x => x.value);
    this.service.updatePage(pageIndex, pageSize, sortCol?.key, sortCol?.value === 'ascend' ? 'ASC' : 'DESC');
  }
}
