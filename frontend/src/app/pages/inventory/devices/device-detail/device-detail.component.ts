import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {DeviceDetailService} from './device-detail.service';
import {DeviceTypes} from '../device-types';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {
  NzFormModule
} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NgIf} from '@angular/common';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {DeviceGroupDto} from '@backend/model/deviceGroupDto';
import {LocationDto} from '@backend/model/locationDto';

interface DeviceDetailForm {
  name: FormControl<string | null>;
  notice: FormControl<string | null>;
  manufactor: FormControl<string | null>;
  dealer: FormControl<string | null>;
  serial: FormControl<string | null>;
  serialManufactor: FormControl<string | null>;
  barcode1: FormControl<string | null>;
  barcode2: FormControl<string | null>;
  producedDate: FormControl<Date | null>;
  activeDate: FormControl<Date | null>;
  decomissionDateManufacture: FormControl<Date | null>;
  decomissionDate: FormControl<Date | null>;
  state: FormControl<number>;
  typeId: FormControl<number | null>;
  groupId: FormControl<number | null>;
  locationId: FormControl<number | null>;
}

@Component({
  selector: 'ofs-device-detail',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSpinModule,
    NzDatePickerModule,
  ],
  templateUrl: './device-detail.component.html',
  styleUrl: './device-detail.component.less'
})
export class DeviceDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;

  private destroy$ = new Subject<void>();

  states = DeviceTypes.all;

  form = new FormGroup<DeviceDetailForm>({
    name: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
    manufactor: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    dealer: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    serial: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    serialManufactor: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    barcode1: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    barcode2: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    producedDate: new FormControl<Date | null>(null),
    activeDate: new FormControl<Date | null>(null),
    decomissionDateManufacture: new FormControl<Date | null>(null),
    decomissionDate: new FormControl<Date | null>(null),
    state: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    typeId: new FormControl<number | null>(null),
    groupId: new FormControl<number | null>(null),
    locationId: new FormControl<number | null>(null),
  });

  deviceTypes: Signal<DeviceTypeDto[]>;
  deviceTypesIsLoading: Signal<boolean>;

  deviceGroups: Signal<DeviceGroupDto[]>;
  deviceGroupsIsLoading: Signal<boolean>;

  locations: Signal<LocationDto[]>;
  locationsIsLoading: Signal<boolean>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: DeviceDetailService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.notFound = this.service.notFound;
    this.loading = this.service.loading;
    this.loadingError = this.service.loadingError;
    this.deleteLoading = this.service.deleteLoading;
    this.updateLoading = this.service.updateLoading;
    this.deviceTypes = this.service.deviceTypes;
    this.deviceTypesIsLoading = this.service.deviceTypesIsLoading;
    this.deviceGroups = this.service.deviceGroups;
    this.deviceGroupsIsLoading = this.service.deviceGroupsIsLoading;
    this.locations = this.service.locations;
    this.locationsIsLoading = this.service.locationsIsLoading;

    effect(() => {
      const entity = this.service.entity();
      if (entity) this.form.patchValue(entity as any);
    });

    effect(() => {
      const updateLoading = this.service.loadingError();
      if (updateLoading) {
        this.inAppMessagingService.showError('Fehler beim laden des Geräts.');
      }
    });
    this.service.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.service.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Gerät gelöscht'));
    this.service.updateLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showError('Fehler beim speichern.'));
    this.service.updateLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));

    this.form.get('typeId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        let type: DeviceTypeDto | undefined;
        if (x) {
          this.form.get('manufactor')?.disable();
          this.form.get('dealer')?.disable();
          type = this.deviceTypes().find(y => y.id === x);
        } else {
          this.form.get('manufactor')?.enable();
          this.form.get('dealer')?.enable();
        }
        this.form.get('manufactor')?.patchValue(type?.manufactor ?? null);
        this.form.get('dealer')?.patchValue(type?.dealer ?? null);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
      this.service.load(params['id']);
    });
  }

  submit() {
    this.service.update(this.form.getRawValue() as any);
  }

  delete() {
    this.service.delete();
  }

  onSearchLocation(search: string) {
    this.service.onSearchLocation(search);
  }

  onSearchType(search: string) {
    this.service.onSearchType(search);
  }

  onSearchGroup(search: string) {
    this.service.onSearchGroup(search);
  }
}
