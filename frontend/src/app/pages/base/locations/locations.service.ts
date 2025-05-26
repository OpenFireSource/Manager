import {Inject, Injectable, signal} from '@angular/core';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter} from 'rxjs';
import {SEARCH_DEBOUNCE_TIME} from '../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  locations = signal<LocationDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  locationsLoading = signal(false);
  locationsLoadError = signal(false);
  sortCol?: string;
  sortDir?: string;
  searchTerm$ = new BehaviorSubject<{propagate: boolean, value: string}>({propagate: true, value: ''});
  private searchTerm?: string;


  constructor(
    private readonly locationService: LocationService,
    @Inject(SEARCH_DEBOUNCE_TIME) time: number,
  ) {
    this.searchTerm$
      .pipe(
        filter(x => x.propagate),
        debounceTime(time),
        distinctUntilChanged(),
      )
      .subscribe(term => {
        this.searchTerm = term.value;
        this.load();
      });
  }

  load() {
    this.locationsLoading.set(true);
    this.locationService.locationControllerGetCount(this.searchTerm)
      .subscribe((count) => this.total.set(count.count));
    this.locationService.locationControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage, this.sortCol, this.sortDir, this.searchTerm)
      .subscribe({
        next: (users) => {
          this.locations.set(users);
          this.locationsLoadError.set(false);
          this.locationsLoading.set(false);
        },
        error: () => {
          this.locations.set([]);
          this.locationsLoadError.set(true);
          this.locationsLoading.set(false);
        }
      });
  }

  updatePage(page: number, itemsPerPage: number, sortCol?: string, sortDir?: string) {
    this.page = page;
    this.itemsPerPage = itemsPerPage;
    this.sortCol = sortCol;
    this.sortDir = this.sortCol ? sortDir : undefined;
    this.load();
  }

  search(term: string) {
    this.searchTerm$.next({propagate: true, value: term});
    this.page = 1;
  }

  init() {
    this.searchTerm = '';
    this.searchTerm$.next({propagate: false, value: ''});
  }
}
