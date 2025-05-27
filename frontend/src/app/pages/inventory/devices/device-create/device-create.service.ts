import {Inject, Injectable, signal} from '@angular/core';
import {BehaviorSubject, debounceTime, filter, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {DeviceService} from '@backend/api/device.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DeviceCreateDto} from '@backend/model/deviceCreateDto';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {DeviceTypeService} from '@backend/api/deviceType.service';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {DeviceGroupService} from '@backend/api/deviceGroup.service';
import {LocationDto} from '@backend/model/locationDto';
import {LocationService} from '@backend/api/location.service';
import {SEARCH_DEBOUNCE_TIME, SELECT_ITEMS_COUNT} from '../../../../app.configs';

@Injectable({
  providedIn: 'root'
})
export class DeviceCreateService {
  createLoading = signal(false);
  createLoadingError = new Subject<string>();
  createLoadingSuccess = new Subject<void>();

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

  create(rawValue: DeviceCreateDto) {
    this.createLoading.set(true);
    this.apiService.deviceControllerCreate(rawValue)
      .subscribe({
        next: (entity) => {
          this.createLoading.set(false);
          this.createLoadingSuccess.next();
          this.router.navigate(['inventory', 'devices', entity.id]);
        },
        error: (err: HttpErrorResponse) => {
          this.createLoading.set(false);
          this.createLoadingError.next(err.status === 400 ? err.error.message : 'Fehler beim speichern.');
        },
      });
  }

  loadMoreTypes() {

    this.deviceTypesIsLoading.set(true);
    this.apiDeviceTypesService
      .deviceTypeControllerGetAll(this.selectCount, 0, undefined, undefined, this.deviceTypesSearch)
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
      .deviceGroupControllerGetAll(this.selectCount, 0, undefined, undefined, this.deviceGroupsSearch)
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
      .locationControllerGetAll(this.selectCount, 0, undefined, undefined, this.locationSearch)
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
