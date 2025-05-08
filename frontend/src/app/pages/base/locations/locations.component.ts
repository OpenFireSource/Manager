import {Component} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {LocationListComponent} from './location-list/location-list.component';

@Component({
  selector: 'ofs-locations',
  imports: [
    HasRoleDirective,
    RouterLink,
    LocationListComponent,
    NzButtonModule,
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.less'
})
export class LocationsComponent {

}
