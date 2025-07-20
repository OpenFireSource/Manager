import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {Form, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {ActivatedRoute} from '@angular/router';
import {ConsumableDetailService} from './consumable-detail.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';

import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {ConsumableDto} from '@backend/model/consumableDto';
import {LocationDto} from '@backend/model/locationDto';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {ConsumableLocationDto} from '@backend/model/consumableLocationDto';

interface ConsumableUpdateForm {
  name: FormControl<string>;
  notice: FormControl<string | null>;
  groupId: FormControl<number | null>;
}

interface ConsumableLocationForm {
  locationId: FormControl<number>;
  quantity: FormControl<number>;
  expirationDate: FormControl<Date | null>;
  notice: FormControl<string | null>;
}

@Component({
  selector: 'ofs-consumable-detail',
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
    NzTabsModule,
    NgForOf,
    NzTableModule,
    NzDrawerModule,
    DatePipe,
  ],
  templateUrl: './consumable-detail.component.html',
  standalone: true,
  styleUrl: './consumable-detail.component.less'
})
export class ConsumableDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;

  private destroy$ = new Subject<void>();
  form = new FormGroup<ConsumableUpdateForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    groupId: new FormControl<number | null>(null, {
      validators: [Validators.min(1)]
    }),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
  });

  formLocation = new FormGroup<ConsumableLocationForm>({
    locationId: new FormControl<number>(0, {
      validators: [Validators.required],
      nonNullable: true,
    }),
    quantity: new FormControl<number>(1, {
      validators: [Validators.required, Validators.min(1)],
      nonNullable: true,
    }),
    expirationDate: new FormControl<Date | null>(null),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
  });

  consumableGroups: Signal<ConsumableGroupDto[]>;
  consumableGroupsIsLoading: Signal<boolean>;
  locations: Signal<LocationDto[]>;
  locationsIsLoading: Signal<boolean>;
  entity: Signal<ConsumableDto | null>;
  locationRelationFormVisible: Signal<boolean>;
  locationRelationFormTitle: Signal<string>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: ConsumableDetailService,
  ) {
    this.entity = this.service.entity;
    this.notFound = this.service.notFound;
    this.loading = this.service.loading;
    this.loadingError = this.service.loadingError;
    this.deleteLoading = this.service.deleteLoading;
    this.updateLoading = this.service.updateLoading;

    this.consumableGroups = this.service.consumableGroups;
    this.consumableGroupsIsLoading = this.service.consumableGroupsIsLoading;
    this.locations = this.service.locations;
    this.locationsIsLoading = this.service.locationsIsLoading;
    this.locationRelationFormVisible = this.service.locationRelationFormVisible;
    this.locationRelationFormTitle = this.service.locationRelationFormTitle;

    effect(() => {
      const entity = this.service.entity();
      if (entity) {
        this.form.patchValue(entity as any);
      }
    });
    effect(() => {
      this.service.resetLocationForm();
      this.formLocation.reset();
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

  onSearchGroup(search: string) {
    this.service.onSearchGroup(search);
  }

  getLocationName(location: LocationDto | null | undefined) {
    return location?.name; // TODO maybe add parent location name if available
  }

  deleteConsumableLocation(id: number) {
    this.service.deleteConsumableLocation(id);
  }

  locationRelationFormClose() {
    this.service.locationRelationFormClose();
    this.formLocation.reset();
  }

  locationRelationFormOpenNew() {
    this.service.locationRelationFormOpenNew();
  }

  locationRelationFormSave() {
    if (this.formLocation.invalid) {
      return;
    }

    if (this.service.locationRelationId()) {
      this.service.locationRelationUpdate(this.formLocation.getRawValue() as any);
    } else {
      this.service.locationRelationCreate(this.formLocation.getRawValue() as any);
    }
  }

  onSearchLocation(value: string) {
    this.service.onSearchLocation(value);
  }

  locationRelationFormEditOpen(value: ConsumableLocationDto) {
    this.formLocation.patchValue({
      locationId: value.locationId,
      quantity: value.quantity,
      expirationDate: value.expirationDate ? new Date(value.expirationDate) : null,
      notice: value.notice || null,
    });
    this.service.locationRelationFormEditOpen(value.id);
  }
}
