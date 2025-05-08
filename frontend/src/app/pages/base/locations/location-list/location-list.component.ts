import {Component, effect, Signal} from '@angular/core';
import {LocationsService} from '../locations.service';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {LocationDto} from '@backend/model/locationDto';
import {NzTableModule, NzTableQueryParams} from 'ng-zorro-antd/table';
import {NgForOf, NgIf} from '@angular/common';
import {HasRoleDirective} from '../../../../core/auth/has-role.directive';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterLink} from '@angular/router';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {LocationTypes} from '../location-types';
import {NzIconModule} from 'ng-zorro-antd/icon';

@Component({
  selector: 'ofs-location-list',
  imports: [NzTableModule, NgForOf, HasRoleDirective, NzButtonModule, RouterLink, NzTypographyModule, NzIconModule, NgIf],
  standalone: true,
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.less'
})
export class LocationListComponent {
  LocationTypes = LocationTypes;

  locations: Signal<LocationDto[]>;
  total: Signal<number>;
  locationsLoading: Signal<boolean>;
  itemsPerPage: number;
  page: number;

  constructor(private readonly locationsService: LocationsService, private readonly inAppMessagingService: InAppMessageService) {
    this.locations = this.locationsService.locations;
    this.total = this.locationsService.total;
    this.locationsLoading = this.locationsService.locationsLoading;
    this.itemsPerPage = this.locationsService.itemsPerPage;
    this.page = this.locationsService.page;

    effect(() => {
      const error = this.locationsService.locationsLoadError();
      if (error) {
        this.inAppMessagingService.showError('Fehler beim laden der Orte/Fahrzeuge.');
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const {pageSize, pageIndex} = params;
    this.locationsService.updatePage(pageIndex, pageSize);
  }
}
