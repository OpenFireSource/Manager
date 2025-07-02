import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {DeviceGroupUpdateDto} from '@backend/model/deviceGroupUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class DeviceGroupDetailService {
  id?: number;
  entity = signal<DeviceGroupDto | null>(null);
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
    private readonly locationService: DeviceGroupService,
    private readonly router: Router,
  ) {
  }

  load(id: number) {
    this.id = id;
    this.loading.set(true);
    this.locationService.deviceGroupControllerGetOne({id})
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

  update(rawValue: DeviceGroupUpdateDto) {
    const entity = this.entity();
    if (entity) {
      this.updateLoading.set(true);
      this.locationService.deviceGroupControllerUpdate({id: entity.id, deviceGroupUpdateDto: rawValue})
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
      this.locationService.deviceGroupControllerDelete({id: entity.id})
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['inventory', 'device-groups']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }
}
