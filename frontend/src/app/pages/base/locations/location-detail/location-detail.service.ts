import {Inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {LocationUpdateDto} from '@backend/model/locationUpdateDto';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';

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

  parentsSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  parentsSearch = '';

  constructor(
    private readonly locationService: LocationService,
    private readonly router: Router,
    @Inject(SEARCH_DEBOUNCE_TIME) time: number,
    @Inject(SELECT_ITEMS_COUNT) private readonly selectCount: number,
  ) {
    this.parentsSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.parentsSearch = x.value;
      this.loadParents();
    });
  }

  load(id: number) {
    this.id = id;
    this.loading.set(true);
    this.locationService.locationControllerGetOne({id})
      .subscribe({
        next: (newEntity) => {
          this.location.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
          if (newEntity.parent) {
            this.parents.set([newEntity.parent]);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.location.set(null);
          this.loadingError.set(true);
          this.loading.set(false);
          this.parents.set([]);
        }
      })
  }

  update(rawValue: LocationUpdateDto) {
    const entity = this.location();
    if (entity) {
      this.updateLoading.set(true);
      this.locationService.locationControllerUpdate({id: entity.id, locationUpdateDto: rawValue})
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
      this.locationService.locationControllerDelete({id: entity.id})
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
      .locationControllerGetAll({
        searchTerm: this.parentsSearch,
        limit: this.selectCount,
      })
      .subscribe({
        next: (parents) => {
          this.parentsIsLoading.set(false);
          this.parents.set(parents.filter(x => x.id !== this.location()?.id));
        },
        error: () => {
          this.parentsIsLoading.set(false);
          this.parents.set([]);
        }
      });
  }

  onSearchParent(value: string): void {
    this.parentsSearch$.next({propagate: true, value});
  }
}
