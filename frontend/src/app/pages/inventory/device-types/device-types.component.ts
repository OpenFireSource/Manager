import {Component, OnInit} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {DeviceTypeListComponent} from './device-type-list/device-type-list.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {DeviceTypesService} from './device-types.service';

@Component({
  selector: 'ofs-device-types',
  imports: [
    HasRoleDirective,
    NzWaveDirective,
    RouterLink,
    DeviceTypeListComponent,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
  ],
  standalone: true,
  templateUrl: './device-types.component.html',
  styleUrl: './device-types.component.less'
})
export class DeviceTypesComponent implements OnInit {
  constructor(private service: DeviceTypesService) {
  }

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit(): void {
    this.service.init();
  }
}
