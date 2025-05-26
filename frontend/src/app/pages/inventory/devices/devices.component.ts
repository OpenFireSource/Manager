import {Component, OnInit} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceListComponent} from './device-list/device-list.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {
  NzInputModule
} from 'ng-zorro-antd/input';
import {DevicesService} from './devices.service';

@Component({
  selector: 'ofs-devices',
  imports: [
    HasRoleDirective,
    NzButtonComponent,
    NzWaveDirective,
    RouterLink,
    DeviceListComponent,
    NzGridModule,
    NzInputModule,
    NzIconModule,
  ],
  standalone: true,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.less'
})
export class DevicesComponent implements OnInit {
  constructor(private readonly service: DevicesService) {
  }

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit(): void {
    this.service.init();
  }
}
