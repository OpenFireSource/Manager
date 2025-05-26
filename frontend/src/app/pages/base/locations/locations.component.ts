import {Component, OnInit} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {LocationListComponent} from './location-list/location-list.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {LocationsService} from './locations.service';

@Component({
  selector: 'ofs-locations',
  imports: [
    HasRoleDirective,
    RouterLink,
    LocationListComponent,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.less'
})
export class LocationsComponent implements OnInit {

  constructor(private readonly service: LocationsService) {
  }

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit(): void {
    this.service.init();
  }
}
