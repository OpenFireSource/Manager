import {Component} from '@angular/core';
import {UserListComponent} from './user-list/user-list.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';

@Component({
  selector: 'ofs-users',
  standalone: true,
  imports: [UserListComponent, NzButtonModule, RouterLink, HasRoleDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.less'
})
export class UsersComponent {
}
