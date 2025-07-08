import {Inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {ConsumableDto} from '@backend/model/consumableDto';
import {ConsumableService} from '@backend/api/consumable.service';
import {Router} from '@angular/router';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';
import {ConsumableGroupService} from '@backend/api/consumableGroup.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ConsumableUpdateDto} from '@backend/model/consumableUpdateDto';

@Injectable({
  providedIn: 'root'
})
export class ConsumableDetailService {
  id?: number;
  entity = signal<ConsumableDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();

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


  load(id: number) {
    this.id = id;

    this.consumableGroups.set([]);
    this.loading.set(true);
    this.apiService.consumableControllerGetOne({id})
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
          if (newEntity.group) {
            this.consumableGroups.set([newEntity.group]);
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.notFound.set(true);
          }
          this.entity.set(null);
          this.loadingError.set(true);
          this.loading.set(false);
        }
      });
  }

  update(rawValue: ConsumableUpdateDto) {
    const entity = this.entity();
    if (entity) {
      this.updateLoading.set(true);
      this.apiService.consumableControllerUpdate({id: entity.id, consumableUpdateDto: rawValue})
        .subscribe({
          next: (newEntity) => {
            this.updateLoading.set(false);
            this.entity.set(newEntity);
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
    const entity = this.entity();
    if (entity) {
      this.deleteLoading.set(true);
      this.apiService.consumableControllerDelete({id: entity.id})
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['inventory', 'consumables']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
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
