import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {LocationService} from '@backend/api/location.service';
import {LocationCreateDto} from '@backend/model/locationCreateDto';
import {LocationDto} from '@backend/model/locationDto';

@Injectable({
  providedIn: 'root'
})
export class LocationCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();
  parentsIsLoading = signal(false);
  parents = signal<LocationDto[]>([]);

  private parentsPage = 0;
  private parentsItemsPerPage = 10;

  constructor(private readonly locationService: LocationService, private readonly router: Router) {
  }

  create(rawValue: LocationCreateDto) {
    this.createLoading.set(true);
    this.locationService.locationControllerCreate(rawValue)
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['base', 'locations', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }

  loadParents(init = false) {
    if (init) {
      this.parentsPage = 0;
      this.parents.set([]);
    }
    this.parentsIsLoading.set(true);
    this.locationService
      .locationControllerGetAll(this.parentsItemsPerPage, this.parentsPage * this.parentsItemsPerPage)
      .subscribe({
        next: (parents) => {
          this.parentsIsLoading.set(false);
          const newParents = [
            ...this.parents(),
            ...parents,
          ];
          this.parents.set(newParents);
          this.parentsPage += 1;
        },
        error: () => {
          this.parentsIsLoading.set(false);
          this.parents.set([]);
          this.parentsPage = 0;
        }
      });
  }
}
