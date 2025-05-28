import {Inject, Injectable, signal} from '@angular/core';
import {DeviceService} from '@backend/api/device.service';
import {DeviceTypeService} from '@backend/api/deviceType.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {DeviceDto} from '@backend/model/deviceDto';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceUpdateDto} from '@backend/model/deviceUpdateDto';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetailService {
  id?: number;
  entity = signal<DeviceDto | null>(null);
  loading = signal(false);
  loadingError = signal(false);
  notFound = signal(false);
  deleteLoading = signal(false);
  updateLoading = signal(false);
  updateLoadingError = new Subject<void>();
  deleteLoadingError = new Subject<string>();
  updateLoadingSuccess = new Subject<void>();
  deleteLoadingSuccess = new Subject<void>();

  deviceTypesSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  deviceTypesSearch = '';
  deviceTypes = signal<DeviceTypeDto[]>([]);
  deviceTypesIsLoading = signal(false);

  deviceGroupsSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  deviceGroupsSearch = '';
  deviceGroups = signal<DeviceGroupDto[]>([]);
  deviceGroupsIsLoading = signal(false);

  locationSearch$ = new BehaviorSubject<{ propagate: boolean; value: string }>({propagate: false, value: ''});
  locationSearch = '';
  locations = signal<LocationDto[]>([]);
  locationsIsLoading = signal(false);

  constructor(
    private readonly apiService: DeviceService,
    private readonly apiDeviceTypesService: DeviceTypeService,
    private readonly apiDeviceGroupsService: DeviceGroupService,
    private readonly apiLocationsService: LocationService,
    private readonly router: Router,
    @Inject(SEARCH_DEBOUNCE_TIME) time: number,
    @Inject(SELECT_ITEMS_COUNT) private readonly selectCount: number,
  ) {
    this.locationSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.locationSearch = x.value;
      this.loadMoreLocations();
    });
    this.deviceTypesSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.deviceTypesSearch = x.value;
      this.loadMoreTypes();
    });
    this.deviceGroupsSearch$.pipe(
      filter(x => x.propagate),
      debounceTime(time),
    ).subscribe((x) => {
      this.deviceGroupsSearch = x.value;
      this.loadMoreGroups();
    });
  }

  load(id: number) {
    this.id = id;

    this.deviceTypes.set([]);
    this.deviceGroups.set([]);
    this.locations.set([]);
    this.loading.set(true);
    this.apiService.deviceControllerGetOne({id})
      .subscribe({
        next: (newEntity) => {
          this.entity.set(newEntity);
          this.loadingError.set(false);
          this.loading.set(false);
          if (newEntity.type) {
            this.deviceTypes.set([newEntity.type]);
          }
          if (newEntity.group) {
            this.deviceGroups.set([newEntity.group]);
          }
          if (newEntity.location) {
            this.locations.set([newEntity.location]);
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

  update(rawValue: DeviceUpdateDto) {
    const entity = this.entity();
    if (entity) {
      this.updateLoading.set(true);
      this.apiService.deviceControllerUpdate({id: entity.id, deviceUpdateDto: rawValue})
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
      this.apiService.deviceControllerDelete({id: entity.id})
        .subscribe({
          next: () => {
            this.deleteLoading.set(false);
            this.deleteLoadingSuccess.next();
            this.router.navigate(['inventory', 'devices']);
          },
          error: (err: HttpErrorResponse) => {
            this.deleteLoading.set(false);
            this.deleteLoadingError.next(err.status === 400 ? err.error : 'Fehler beim löschen');
          },
        });
    }
  }

  loadMoreTypes() {
    this.deviceTypesIsLoading.set(true);
    this.apiDeviceTypesService
      .deviceTypeControllerGetAll({
        limit: this.selectCount,
        searchTerm: this.deviceTypesSearch,
      })
      .subscribe({
        next: (deviceTypes) => {
          this.deviceTypesIsLoading.set(false);
          this.deviceTypes.set(deviceTypes);
        },
        error: () => {
          this.deviceTypesIsLoading.set(false);
          this.deviceTypes.set([]);
        }
      });
  }

  loadMoreGroups() {
    this.deviceGroupsIsLoading.set(true);
    this.apiDeviceGroupsService
      .deviceGroupControllerGetAll({
        limit: this.selectCount,
        searchTerm: this.deviceGroupsSearch,
      })
      .subscribe({
        next: (deviceGroups) => {
          this.deviceGroupsIsLoading.set(false);
          this.deviceGroups.set(deviceGroups);
        },
        error: () => {
          this.deviceGroupsIsLoading.set(false);
          this.deviceGroups.set([]);
        }
      });
  }

  loadMoreLocations() {
    this.locationsIsLoading.set(true);
    this.apiLocationsService
      .locationControllerGetAll({
        limit: this.selectCount,
        searchTerm: this.locationSearch,
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

  onSearchLocation(value: string): void {
    this.locationSearch$.next({propagate: true, value});
  }

  onSearchType(value: string): void {
    this.deviceTypesSearch$.next({propagate: true, value});
  }

  onSearchGroup(value: string): void {
    this.deviceGroupsSearch$.next({propagate: true, value});
  }
}
