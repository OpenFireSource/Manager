import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {DeviceTypeService} from '@backend/api/deviceType.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DeviceTypeUpdateDto} from '@backend/model/deviceTypeUpdateDto';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeDetailService {
  id?: number;
  entity = signal<DeviceTypeDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();

  constructor(
    private readonly locationService: DeviceTypeService,
    private readonly router: Router,
  ) {
  }

  load(id: number) {
    this.id = id;
    this.loading.set(true);
    this.locationService.deviceTypeControllerGetOne(id)
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
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

  update(rawValue: DeviceTypeUpdateDto) {
    const entity = this.entity();
    if (entity) {
      this.updateLoading.set(true);
      this.locationService.deviceTypeControllerUpdate(entity.id, rawValue)
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
      this.locationService.deviceTypeControllerDelete(entity.id)
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['inventory', 'device-types']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }
}
