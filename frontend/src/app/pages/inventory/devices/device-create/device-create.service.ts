import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {DeviceService} from '@backend/api/device.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DeviceCreateDto} from '@backend/model/deviceCreateDto';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceTypeService} from '@backend/api/deviceType.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  deviceTypes = signal<DeviceTypeDto[]>([]);
  deviceTypesIsLoading = signal(false);

  private deviceTypesPage = 0;
  private deviceTypesItemsPerPage = 10;

  constructor(
    private readonly apiService: DeviceService,
    private readonly apiDeviceTypesService: DeviceTypeService,
    private readonly router: Router,
  ) {
  }

  create(rawValue: DeviceCreateDto) {
    this.createLoading.set(true);
    this.apiService.deviceControllerCreate(rawValue)
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'devices', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }

  loadMoreTypes(init = false) {
    if (init) {
      this.deviceTypesPage = 0;
      this.deviceTypes.set([]);
    }
    this.deviceTypesIsLoading.set(true);
    this.apiDeviceTypesService
      .deviceTypeControllerGetAll(this.deviceTypesItemsPerPage, this.deviceTypesPage * this.deviceTypesItemsPerPage)
      .subscribe({
        next: (deviceTypes) => {
          this.deviceTypesIsLoading.set(false);
          const newDeviceTypes = [
            ...this.deviceTypes(),
            ...deviceTypes,
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
}
