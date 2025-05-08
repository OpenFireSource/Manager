import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {Subject, takeUntil} from 'rxjs';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {DeviceTypeCreateService} from './device-type-create.service';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';

interface DeviceTypeCreateForm {
  name: FormControl<string>;
  notice?: FormControl<string | null>;
  pricePerUnit?: FormControl<number | null>;
  manufactor?: FormControl<string | null>;
  dealer?: FormControl<string | null>;
  visualInspectionAfterUsage: FormControl<boolean>;
}

@Component({
  selector: 'ofs-device-type-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzInputNumberModule],
  standalone: true,
  templateUrl: './device-type-create.component.html',
  styleUrl: './device-type-create.component.less'
})
export class DeviceTypeCreateComponent implements OnDestroy {
  form = new FormGroup<DeviceTypeCreateForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
    pricePerUnit: new FormControl<number | null>(null, {
      validators: []
    }),
    manufactor: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    dealer: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(100)]
    }),
    visualInspectionAfterUsage: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: []
    }),
  });

  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly service: DeviceTypeCreateService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.createLoading = this.service.createLoading;

    this.service.createLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.service.createLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  submit() {
    this.service.create(this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
