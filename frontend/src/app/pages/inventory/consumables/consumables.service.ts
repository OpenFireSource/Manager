import {Injectable, Inject, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, filter, Observable} from 'rxjs';
import {ConsumableDto, ConsumableCreateDto, ConsumableUpdateDto, CountDto, ConsumableService} from '@backend/index';
import {SEARCH_DEBOUNCE_TIME} from '../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class ConsumablesService {
  entities = signal<ConsumableDto[]>([]);
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
    private readonly apiService: ConsumableService,
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
    this.apiService.consumableControllerGetCount({searchTerm: this.searchTerm})
      .subscribe((count) => this.total.set(count.count));
    this.apiService.consumableControllerGetAll({
      limit: this.itemsPerPage,
      offset: (this.page - 1) * this.itemsPerPage,
      sortCol: this.sortCol,
      sortDir: this.sortDir,
      searchTerm: this.searchTerm
    })
      .subscribe({
        next: (entities) => {
          this.entities.set(entities);
          this.entitiesLoading.set(false);
          this.entitiesLoadError.set(false);
        },
        error: () => {
          this.entitiesLoading.set(false);
          this.entitiesLoadError.set(true);
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
