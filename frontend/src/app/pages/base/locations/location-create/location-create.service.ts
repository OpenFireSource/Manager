import {Inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {LocationService} from '@backend/api/location.service';
import {LocationCreateDto} from '@backend/model/locationCreateDto';
import {LocationDto} from '@backend/model/locationDto';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class LocationCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();
  parentsIsLoading = signal(false);
  parents = signal<LocationDto[]>([]);

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

  create(rawValue: LocationCreateDto) {
    this.createLoading.set(true);
    this.locationService.locationControllerCreate({locationCreateDto: rawValue})
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
          this.parents.set(parents);
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
