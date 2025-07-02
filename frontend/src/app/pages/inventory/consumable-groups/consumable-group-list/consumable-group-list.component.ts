import {Component} from '@angular/core';
import {ConsumableGroupsService} from '../consumable-groups.service';
import {NzTableModule} from 'ng-zorro-antd/table';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'ofs-consumable-group-list',
  imports: [
    NzTableModule,
    CommonModule
  ],
  standalone: true,
  template: `
    <nz-table #basicTable [nzData]="service.entities()" [nzLoading]="service.entitiesLoading()">
      <thead>
        <tr>
          <th>Name</th>
          <th>Bemerkung</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of basicTable.data">
          <td>{{ entity.name }}</td>
          <td>{{ entity.notice || '-' }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styleUrls: []
})
export class ConsumableGroupListComponent {
  constructor(public service: ConsumableGroupsService) {}
}