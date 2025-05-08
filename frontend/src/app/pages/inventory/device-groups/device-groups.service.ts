import {Injectable, signal} from '@angular/core';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceGroupsService {
  entities = signal<DeviceGroupDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  entitiesLoading = signal(false);
  entitiesLoadError = signal(false);

  constructor(private readonly apiService: DeviceGroupService) {
  }

  load() {
    this.entitiesLoading.set(true);
    this.apiService.deviceGroupControllerGetCount()
      .subscribe((count) => this.total.set(count.count));
    this.apiService.deviceGroupControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage)
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
