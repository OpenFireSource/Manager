import {Injectable, signal} from '@angular/core';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  locations = signal<LocationDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  locationsLoading = signal(false);
  locationsLoadError = signal(false);
  sortCol?: string;
  sortDir?: string;

  constructor(private readonly locationService: LocationService) {
  }

  load() {
    this.locationsLoading.set(true);
    this.locationService.locationControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.locationService.locationControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage, this.sortCol, this.sortDir)
      .subscribe({
        next: (users) => {
          this.locations.set(users);
          this.locationsLoadError.set(false);
          this.locationsLoading.set(false);
        },
        error: () => {
          this.locations.set([]);
          this.locationsLoadError.set(true);
          this.locationsLoading.set(false);
        }
      });
  }

  updatePage(page: number, itemsPerPage: number, sortCol?: string, sortDir?: string) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.sortCol = sortCol;
    this.sortDir = this.sortCol ? sortDir : undefined;
    this.load();
  }
}
