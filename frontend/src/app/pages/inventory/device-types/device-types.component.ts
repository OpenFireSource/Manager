import {Component} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceTypeListComponent} from './device-type-list/device-type-list.component';

@Component({
  selector: 'ofs-device-types',
  imports: [
    HasRoleDirective,
    NzButtonComponent,
    NzWaveDirective,
    RouterLink,
    DeviceTypeListComponent
  ],
  standalone: true,
  templateUrl: './device-types.component.html',
  styleUrl: './device-types.component.less'
})
export class DeviceTypesComponent {

}
