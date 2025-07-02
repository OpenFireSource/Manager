import { Component, OnInit } from '@angular/core';
import { ConsumablesService } from './consumables.service';
import { ConsumableListComponent } from './consumable-list/consumable-list.component';

@Component({
  selector: 'app-consumables',
  imports: [
    ConsumableListComponent
  ],
  standalone: true,
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.less']
})
export class ConsumablesComponent implements OnInit {
  constructor(private service: ConsumablesService) {}

  ngOnInit() {
    this.service.load();
  }
}