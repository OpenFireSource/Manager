import {Injectable, signal} from '@angular/core';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {LocationUpdateDto} from '@backend/model/locationUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class LocationDetailService {
  id?: number;
  location = signal<LocationDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  parentsIsLoading = signal(false);
  parents = signal<LocationDto[]>([]);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();

  private parentsPage = 0;
  private parentsItemsPerPage = 10;

  constructor(
    private readonly locationService: LocationService,
    private readonly router: Router,
  ) {
  }

  load(id: number) {
    this.id = id;
    this.parentsPage = 0;
    this.parents.set([]);
    this.loading.set(true);
    this.locationService.locationControllerGetOne(id)
      .subscribe({
        next: (newEntity) => {
          this.location.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
          if (newEntity.parent) {
            this.parents.set([newEntity.parent]);
          }
          this.loadParents();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.location.set(null);
          this.loadingError.set(true);
          this.loading.set(false);
          this.parents.set([]);
          this.parentsPage = 0;
        }
      })
  }

  update(rawValue: LocationUpdateDto) {
    const entity = this.location();
    if (entity) {
      this.updateLoading.set(true);
      this.locationService.locationControllerUpdate(entity.id, rawValue)
        .subscribe({
          next: (newEntity) => {
            this.updateLoading.set(false);
            this.location.set(newEntity);
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
    const entity = this.location();
    if (entity) {
      this.deleteLoading.set(true);
      this.locationService.locationControllerDelete(entity.id)
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['base', 'locations']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }

  loadParents() {
    this.parentsIsLoading.set(true);
    this.locationService
      .locationControllerGetAll(this.parentsItemsPerPage, this.parentsPage * this.parentsItemsPerPage)
      .subscribe({
        next: (parents) => {
          this.parentsIsLoading.set(false);
          const newParents = [
            ...this.parents(),
            ...parents.filter(x => x.id != this.location()?.parentId && x.id != this.id),
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
