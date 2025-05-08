import {Component, effect, Signal} from '@angular/core';
import {UsersService} from '../users.service';
import {UserDto} from '@backend/model/userDto';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NgForOf} from '@angular/common';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzTypographyModule} from 'ng-zorro-antd/typography';

@Component({
  selector: 'ofs-user-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule],
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.less'
})
export class UserListComponent {
  users: Signal<UserDto[]>;
  total: Signal<number>;
  usersLoading: Signal<boolean>;

  constructor(private readonly userService: UsersService, private readonly inAppMessagingService: InAppMessageService) {
    this.users = this.userService.users;
    this.total = this.userService.total;
    this.usersLoading = this.userService.usersLoading;

    effect(() => {
      const error = this.userService.usersLoadError();
      if (error) {
        this.inAppMessagingService.showError('Fehler beim laden der Benutzer.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex} = params;
    this.userService.updatePage(pageIndex - 1, pageSize);
  }
}
