import {Injectable, signal} from '@angular/core';
import {DeviceDto} from '@backend/model/deviceDto';
import {DeviceService} from '@backend/api/device.service';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  entities = signal<DeviceDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  entitiesLoading = signal(false);
  entitiesLoadError = signal(false);
  sortCol?: string;
  sortDir?: string;

  constructor(private readonly apiService: DeviceService) {
  }

  load() {
    this.entitiesLoading.set(true);
    this.apiService.deviceControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.apiService.deviceControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage, undefined,
      undefined, undefined, this.sortCol, this.sortDir)
      .subscribe({
        next: (entities) => {
          this.entities.set(entities);
          this.entitiesLoadError.set(false);
          this.entitiesLoading.set(false);
        },
        error: () => {
          this.entities.set([]);
          this.entitiesLoadError.set(true);
          this.entitiesLoading.set(false);
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
