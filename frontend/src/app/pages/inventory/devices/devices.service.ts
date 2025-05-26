import {Inject, Injectable, signal} from '@angular/core';
import {DeviceDto} from '@backend/model/deviceDto';
import {DeviceService} from '@backend/api/device.service';
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter} from 'rxjs';
import {SEARCH_DEBOUNCE_TIME} from '../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {
  entities = signal<DeviceDto[]>([]);
  page = 1;
  itemsPerPage = 20;
  total = signal(0);
  entitiesLoading = signal(false);
  entitiesLoadError = signal(false);
  sortCol?: string;
  sortDir?: string;
  searchTerm$ = new BehaviorSubject<{ propagate: boolean, value: string }>({propagate: true, value: ''});
  private searchTerm?: string;

  constructor(
    private readonly apiService: DeviceService,
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
    this.entitiesLoading.set(true);
    this.apiService.deviceControllerGetCount(this.searchTerm)
      .subscribe((count) => this.total.set(count.count));
    this.apiService.deviceControllerGetAll(this.itemsPerPage, (this.page - 1) * this.itemsPerPage, undefined,
      undefined, undefined, this.sortCol, this.sortDir, this.searchTerm)
      .subscribe({
        next: (entities) => {
          this.entities.set(entities);
          this.entitiesLoadError.set(false);
          this.entitiesLoading.set(false);
        },
        error: () => {
          this.entities.set([]);
          this.entitiesLoadError.set(true);
          this.entitiesLoading.set(false);
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
