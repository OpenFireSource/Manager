import { Component, OnInit } from '@angular/core';
import { ConsumablesService } from './consumables.service';
import { ConsumableListComponent } from './consumable-list/consumable-list.component';
import {HasRoleDirective} from '../../../core/auth/has-role.directive';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {NzInputDirective, NzInputGroupComponent, NzInputGroupWhitSuffixOrPrefixDirective} from 'ng-zorro-antd/input';
import {NzWaveDirective} from 'ng-zorro-antd/core/wave';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'ofs-consumables',
  imports: [
    ConsumableListComponent,
    HasRoleDirective,
    NzButtonComponent,
    NzColDirective,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzInputGroupWhitSuffixOrPrefixDirective,
    NzRowDirective,
    NzWaveDirective,
    RouterLink
  ],
  standalone: true,
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.less']
})
export class ConsumablesComponent implements OnInit {
  constructor(private service: ConsumablesService) {}

  search($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.service.search(target.value);
  }

  ngOnInit() {
    this.service.init();
  }
}
