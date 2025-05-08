import {Injectable, signal} from '@angular/core';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceTypeService} from '@backend/api/deviceType.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypesService {
  entities = signal<DeviceTypeDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  entitiesLoading = signal(false);
  entitiesLoadError = signal(false);

  constructor(private readonly apiService: DeviceTypeService) {
  }

  load() {
    this.entitiesLoading.set(true);
    this.apiService.deviceTypeControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.apiService.deviceTypeControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage)
      .subscribe({
        next: (users) => {
          this.entities.set(users);
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

  updatePage(page: number, itemsPerPage: number) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.load();
  }
}
