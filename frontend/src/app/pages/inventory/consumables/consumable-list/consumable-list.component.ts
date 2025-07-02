import { Component } from '@angular/core';
import { ConsumablesService } from '../consumables.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ofs-consumable-list',
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
          <th>Menge</th>
          <th>Ablaufdatum</th>
          <th>Gruppe</th>
          <th>Standorte</th>
          <th>Bemerkung</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let entity of basicTable.data">
          <td>{{ entity.name || '-' }}</td>
          <td>{{ entity.quantity }}</td>
          <td>{{ entity.expirationDate || '-' }}</td>
          <td>{{ entity.group?.name || '-' }}</td>
          <td>
            <span *ngFor="let location of entity.locations; let last = last">
              {{ location.name }}<span *ngIf="!last">, </span>
            </span>
            <span *ngIf="!entity.locations || entity.locations.length === 0">-</span>
          </td>
          <td>{{ entity.notice || '-' }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styleUrls: []
})
export class ConsumableListComponent {
  constructor(public service: ConsumablesService) {}
}