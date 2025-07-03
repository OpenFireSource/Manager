import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {ConsumableGroupService} from '@backend/api/consumableGroup.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ConsumableGroupCreateDto} from '@backend/model/consumableGroupCreateDto';

@Injectable({
  providedIn: 'root'
})
export class ConsumableGroupCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  constructor(
    private readonly apiService: ConsumableGroupService,
    private readonly router: Router,
  ) {
  }

  create(rawValue: ConsumableGroupCreateDto) {
    this.createLoading.set(true);
    this.apiService.consumableGroupControllerCreate({consumableGroupCreateDto: rawValue})
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'consumable-groups', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }
}
