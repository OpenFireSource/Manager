import {Injectable, signal} from '@angular/core';
import {DeviceService} from '@backend/api/device.service';
import {DeviceTypeService} from '@backend/api/deviceType.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {Subject} from 'rxjs';
import {DeviceDto} from '@backend/model/deviceDto';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceUpdateDto} from '@backend/model/deviceUpdateDto';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailService {
  id?: number;
  entity = signal<DeviceDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();

  deviceTypes = signal<DeviceTypeDto[]>([]);
  deviceTypesIsLoading = signal(false);
  private deviceTypesPage = 0;
  private deviceTypesItemsPerPage = 10;

  deviceGroups = signal<DeviceGroupDto[]>([]);
  deviceGroupsIsLoading = signal(false);
  private deviceGroupsPage = 0;
  private deviceGroupsItemsPerPage = 10;

  constructor(
    private readonly apiService: DeviceService,
    private readonly apiDeviceTypesService: DeviceTypeService,
    private readonly apiDeviceGroupsService: DeviceGroupService,
    private readonly router: Router,
  ) {
  }

  load(id: number) {
    this.id = id;
    this.deviceTypesPage = 0;
    this.deviceGroupsPage = 0;
    this.deviceTypes.set([]);
    this.deviceGroups.set([]);
    this.loading.set(true);
    this.apiService.deviceControllerGetOne(id)
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
          if (newEntity.type) {
            this.deviceTypes.set([newEntity.type]);
          }
          if (newEntity.group) {
            this.deviceGroups.set([newEntity.group]);
          }
          this.loadMoreTypes();
          this.loadMoreGroups();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.entity.set(null);
          this.loadingError.set(true);
          this.loading.set(false);
        }
      });
  }

  update(rawValue: DeviceUpdateDto) {
    const entity = this.entity();
    if (entity) {
      this.updateLoading.set(true);
      this.apiService.deviceControllerUpdate(entity.id, rawValue)
        .subscribe({
          next: (newEntity) => {
            this.updateLoading.set(false);
            this.entity.set(newEntity);
            this.updateLoadingSuccess.next();
          },
          error: () => {
            this.updateLoading.set(false);
            this.updateLoadingError.next();
          },
        });
    }
  }

  delete() {
    const entity = this.entity();
    if (entity) {
      this.deleteLoading.set(true);
      this.apiService.deviceControllerDelete(entity.id)
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['inventory', 'devices']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }

  loadMoreTypes() {
    this.deviceTypesIsLoading.set(true);
    this.apiDeviceTypesService
      .deviceTypeControllerGetAll(this.deviceTypesItemsPerPage, this.deviceTypesPage * this.deviceTypesItemsPerPage)
      .subscribe({
        next: (deviceTypes) => {
          this.deviceTypesIsLoading.set(false);
          const newDeviceTypes = [
            ...this.deviceTypes(),
            ...deviceTypes.filter(x => x.id != this.entity()?.typeId && x.id != this.id),
          ];
          this.deviceTypes.set(newDeviceTypes);
          this.deviceTypesPage += 1;
        },
        error: () => {
          this.deviceTypesIsLoading.set(false);
          this.deviceTypes.set([]);
          this.deviceTypesPage = 0;
        }
      });
  }

  loadMoreGroups() {
    this.deviceGroupsIsLoading.set(true);
    this.apiDeviceGroupsService
      .deviceGroupControllerGetAll(this.deviceGroupsItemsPerPage, this.deviceGroupsPage * this.deviceGroupsItemsPerPage)
      .subscribe({
        next: (deviceGroups) => {
          this.deviceGroupsIsLoading.set(false);
          const newDeviceGroups = [
            ...this.deviceGroups(),
            ...deviceGroups.filter(x => x.id != this.entity()?.groupId && x.id != this.id),
          ];
          this.deviceGroups.set(newDeviceGroups);
          this.deviceGroupsPage += 1;
        },
        error: () => {
          this.deviceGroupsIsLoading.set(false);
          this.deviceGroups.set([]);
          this.deviceGroupsPage = 0;
        }
      });
  }
}
