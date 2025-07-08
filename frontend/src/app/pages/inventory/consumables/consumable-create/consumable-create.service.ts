import {Inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {ConsumableService} from '@backend/api/consumable.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ConsumableCreateDto} from '@backend/model/consumableCreateDto';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';
import {ConsumableGroupService} from '@backend/api/consumableGroup.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumableCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

  consumableGroupsSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  consumableGroupsSearch = '';
  consumableGroups = signal<ConsumableGroupDto[]>([]);
  consumableGroupsIsLoading = signal(false);

  constructor(
    private readonly apiService: ConsumableService,
    private readonly apiConsumableGroupsService: ConsumableGroupService,
    private readonly router: Router,
    @Inject(SEARCH_DEBOUNCE_TIME) time: number,
    @Inject(SELECT_ITEMS_COUNT) private readonly selectCount: number,
  ) {
    this.consumableGroupsSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.consumableGroupsSearch = x.value;
      this.loadMoreGroups();
    });
  }

  create(rawValue: ConsumableCreateDto) {
    this.createLoading.set(true);
    this.apiService.consumableControllerCreate({consumableCreateDto: rawValue})
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'consumables', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }

  loadMoreGroups() {
    this.consumableGroupsIsLoading.set(true);
    this.apiConsumableGroupsService
      .consumableGroupControllerGetAll({
        limit: this.selectCount,
        searchTerm: this.consumableGroupsSearch,
      })
      .subscribe({
        next: (deviceGroups) => {
          this.consumableGroupsIsLoading.set(false);
          this.consumableGroups.set(deviceGroups);
        },
        error: () => {
          this.consumableGroupsIsLoading.set(false);
          this.consumableGroups.set([]);
        }
      });
  }

  onSearchGroup(value: string): void {
    this.consumableGroupsSearch$.next({propagate: true, value});
  }
}
