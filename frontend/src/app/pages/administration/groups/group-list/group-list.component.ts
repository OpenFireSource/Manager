import {Component, effect, Signal} from '@angular/core';
import {GroupDto} from '@backend/model/groupDto';
import {GroupsService} from '../groups.service';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NgForOf} from '@angular/common';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzTypographyModule} from 'ng-zorro-antd/typography';

@Component({
  selector: 'ofs-group-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule],
  standalone: true,
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.less'
})
export class GroupListComponent {
  groups: Signal<GroupDto[]>;
  total: Signal<number>;
  usersLoading: Signal<boolean>;

  constructor(private readonly groupsService: GroupsService, private readonly inAppMessagingService: InAppMessageService) {
    this.groups = this.groupsService.groups;
    this.total = this.groupsService.total;
    this.usersLoading = this.groupsService.groupsLoading;

    effect(() => {
      const error = this.groupsService.groupsLoadError();
      if (error) {
        this.inAppMessagingService.showError('Fehler beim laden der Gruppen.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex} = params;
    this.groupsService.updatePage(pageIndex - 1, pageSize);
  }
}
