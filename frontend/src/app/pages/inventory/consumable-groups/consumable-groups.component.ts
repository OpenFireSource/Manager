import {Component, OnInit} from '@angular/core';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';
import {ConsumableGroupListComponent} from './consumable-group-list/consumable-group-list.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {ConsumableGroupsService} from './consumable-groups.service';

@Component({
  selector: 'ofs-consumable-groups',
  imports: [
    HasRoleDirective,
    NzWaveDirective,
    RouterLink,
    ConsumableGroupListComponent,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
  ],
  standalone: true,
  templateUrl: './consumable-groups.component.html',
  styleUrl: './consumable-groups.component.less'
})
export class ConsumableGroupsComponent implements OnInit {
  constructor(private service: ConsumableGroupsService) {
  }

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit(): void {
    this.service.init();
  }
}
