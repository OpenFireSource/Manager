import {Component, OnInit} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceGroupListComponent} from './device-group-list/device-group-list.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {DeviceGroupsService} from './device-groups.service';

@Component({
  selector: 'ofs-device-groups',
  imports: [
    HasRoleDirective,
    NzWaveDirective,
    RouterLink,
    DeviceGroupListComponent,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
  ],
  standalone: true,
  templateUrl: './device-groups.component.html',
  styleUrl: './device-groups.component.less'
})
export class DeviceGroupsComponent implements OnInit {
  constructor(private service: DeviceGroupsService) {
  }

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit(): void {
    this.service.init();
  }
}
