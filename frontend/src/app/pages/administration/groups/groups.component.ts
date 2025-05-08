import {Component} from '@angular/core';
import {GroupListComponent} from './group-list/group-list.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';

@Component({
  selector: 'ofs-groups',
  imports: [GroupListComponent, NzButtonModule, RouterLink, HasRoleDirective],
  standalone: true,
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.less'
})
export class GroupsComponent {

}
