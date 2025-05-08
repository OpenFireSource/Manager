import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {DeviceTypeService} from '@backend/api/deviceType.service';
import {DeviceTypeCreateDto} from '@backend/model/deviceTypeCreateDto';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  constructor(
    private readonly apiService: DeviceTypeService,
    private readonly router: Router,
  ) {
  }

  create(rawValue: DeviceTypeCreateDto) {
    this.createLoading.set(true);
    this.apiService.deviceTypeControllerCreate(rawValue)
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'device-types', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }
}
