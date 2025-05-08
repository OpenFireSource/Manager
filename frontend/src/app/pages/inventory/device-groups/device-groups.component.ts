import { Component } from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceGroupListComponent} from './device-group-list/device-group-list.component';

@Component({
  selector: 'ofs-device-groups',
  imports: [
    HasRoleDirective,
    NzButtonComponent,
    NzWaveDirective,
    RouterLink,
    DeviceGroupListComponent
  ],
  standalone: true,
  templateUrl: './device-groups.component.html',
  styleUrl: './device-groups.component.less'
})
export class DeviceGroupsComponent {

}
