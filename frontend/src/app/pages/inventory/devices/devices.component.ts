import {Component} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceListComponent} from './device-list/device-list.component';

@Component({
  selector: 'ofs-devices',
  imports: [
    HasRoleDirective,
    NzButtonComponent,
    NzWaveDirective,
    RouterLink,
    DeviceListComponent
  ],
  standalone: true,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.less'
})
export class DevicesComponent {

}
