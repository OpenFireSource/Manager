import {Inject, Injectable, Signal, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {ConsumableDto} from '@backend/model/consumableDto';
import {ConsumableService} from '@backend/api/consumable.service';
import {Router} from '@angular/router';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';
import {ConsumableGroupService} from '@backend/api/consumableGroup.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ConsumableUpdateDto} from '@backend/model/consumableUpdateDto';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {ConsumableLocationAddDto} from '@backend/model/consumableLocationAddDto';
import {ConsumableLocationUpdateDto} from '@backend/model/consumableLocationUpdateDto';

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
  locationRelationFormVisible = signal(false);
  locationRelationFormTitle = signal("");
  resetLocationForm = signal(false);

  consumableGroupsSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  consumableGroupsSearch = '';
  consumableGroups = signal<ConsumableGroupDto[]>([]);
  consumableGroupsIsLoading = signal(false);

  locationSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  locationSearch = '';
  locations = signal<LocationDto[]>([]);
  locationsIsLoading = signal(false);

  locationRelationId = signal<number | null>(null);

  constructor(
    private readonly apiService: ConsumableService,
    private readonly apiConsumableGroupsService: ConsumableGroupService,
    private readonly apiLocationsService: LocationService,
    private readonly router: Router,
    private readonly inAppMessagingService: InAppMessageService,
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
    this.locationSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.locationSearch = x.value;
      this.loadMoreLocations();
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
          this.inAppMessagingService.showError('Fehler beim laden des Geräts.');
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
            this.inAppMessagingService.showSuccess('Gerät gelöscht');
          },
          error: () => {
            this.updateLoading.set(false);
            this.inAppMessagingService.showError('Fehler beim speichern.');
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
            this.inAppMessagingService.showInfo('Material wurde gelöscht.')
            this.router.navigate(['inventory', 'consumables']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.inAppMessagingService.showError(err.status === 400 ? err.error : 'Fehler beim löschen');
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

  loadMoreLocations() {
    this.locationsIsLoading.set(true);
    this.apiLocationsService
      .locationControllerGetAll({
        limit: this.selectCount,
        searchTerm: this.locationSearch
      })
      .subscribe({
        next: (locations) => {
          this.locationsIsLoading.set(false);
          this.locations.set(locations);
        },
        error: () => {
          this.locationsIsLoading.set(false);
          this.locations.set([]);
        }
      });
  }

  onSearchGroup(value: string): void {
    this.consumableGroupsSearch$.next({propagate: true, value});
  }

  deleteConsumableLocation(id: number) {
    this.apiService.consumableControllerRemoveLocation({
      id: this.id!,
      relationId: id,
    }).subscribe(
      {
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.inAppMessagingService.showSuccess('Material wurde entfernt.');
        },
        error: (err: HttpErrorResponse) => {
          this.inAppMessagingService.showError(err.status === 400 ? err.error : 'Fehler beim entfernen des Materials');
        }
      }
    );
  }

  locationRelationFormClose() {
    this.locationRelationFormVisible.set(false);
  }

  locationRelationFormOpenNew() {
    this.locationRelationId.set(null);
    this.locationSearch$.next({propagate: true, value: ''});
    this.locationRelationFormTitle.set("Material - Ort anlegen")
    this.locationRelationFormVisible.set(true);
  }

  locationRelationFormEditOpen(relationId: number) {
    this.locationRelationId.set(relationId);
    this.locationSearch$.next({propagate: true, value: ''});
    this.locationRelationFormTitle.set("Material - Ort bearbeiten")
    this.locationRelationFormVisible.set(true);
  }

  onSearchLocation(value: string): void {
    this.locationSearch$.next({propagate: true, value});
  }

  locationRelationCreate(value: ConsumableLocationAddDto) {
    this.apiService.consumableControllerAddLocation({id: this.id!, consumableLocationAddDto: value})
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.locationRelationFormVisible.set(false);
          this.resetLocationForm.set(!this.resetLocationForm());
          this.inAppMessagingService.showSuccess('Material wurde angelegt.');
        },
        error: (err: HttpErrorResponse) => {
          this.inAppMessagingService.showError(err.status === 400 ? err.error : 'Fehler beim Anlegen des Materials');
        }
      });
  }

  locationRelationUpdate(value: ConsumableLocationUpdateDto) {
    if (!this.locationRelationId()) return;

    this.apiService.consumableControllerUpdateLocation({
      id: this.id!,
      consumableLocationUpdateDto: value,
      relationId: this.locationRelationId()!,
    })
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.locationRelationFormVisible.set(false);
          this.resetLocationForm.set(!this.resetLocationForm());
          this.inAppMessagingService.showSuccess('Material wurde aktualisiert.');
        },
        error: (err: HttpErrorResponse) => {
          this.inAppMessagingService.showError(err.status === 400 ? err.error : 'Fehler beim Aktualisieren des Materials');
        }
      });
  }
}
