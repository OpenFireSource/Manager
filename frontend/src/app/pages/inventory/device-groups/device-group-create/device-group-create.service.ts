import {Injectable, signal} from '@angular/core';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {DeviceGroupCreateDto} from '@backend/model/deviceGroupCreateDto';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeviceGroupCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  constructor(
    private readonly apiService: DeviceGroupService,
    private readonly router: Router,
  ) {
  }

  create(rawValue: DeviceGroupCreateDto) {
    this.createLoading.set(true);
    this.apiService.deviceGroupControllerCreate({deviceGroupCreateDto: rawValue})
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'device-groups', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }
}
