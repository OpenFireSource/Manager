import {Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {Subject, takeUntil} from 'rxjs';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {DeviceCreateService} from './device-create.service';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {DeviceTypes} from '../device-types';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {DeviceTypeDto} from '@backend/model/deviceTypeDto';
import {NzSpinComponent} from 'ng-zorro-antd/spin';

interface DeviceCreateForm {
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
}

// TODO Geräte-Typ durch eintippen von filtern
@Component({
  selector: 'ofs-device-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzInputNumberModule, NzDatePickerModule, NzOptionComponent, NzSelectComponent, NzSpinComponent],
  standalone: true,
  templateUrl: './device-create.component.html',
  styleUrl: './device-create.component.less'
})
export class DeviceCreateComponent implements OnInit, OnDestroy {
  states = DeviceTypes.all;

  form = new FormGroup<DeviceCreateForm>({
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
  });

  deviceTypes: Signal<DeviceTypeDto[]>;
  deviceTypesIsLoading: Signal<boolean>;
  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly service: DeviceCreateService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.createLoading = this.service.createLoading;
    this.deviceTypes = this.service.deviceTypes;
    this.deviceTypesIsLoading = this.service.deviceTypesIsLoading;

    this.service.createLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.service.createLoadingSuccess
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

  submit() {
    this.service.create(this.form.getRawValue() as any); // TODO
  }

  loadMore() {
    this.service.loadMoreTypes();
  }

  ngOnInit(): void {
    this.service.loadMoreTypes(true);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
