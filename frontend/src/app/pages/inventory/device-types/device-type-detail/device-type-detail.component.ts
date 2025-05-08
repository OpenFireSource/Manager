import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {DeviceTypeDetailService} from './device-type-detail.service';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NgIf} from '@angular/common';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';

interface DeviceTypeDetailForm {
  name: FormControl<string>;
  notice?: FormControl<string | null>;
  pricePerUnit?: FormControl<number | null>;
  manufactor?: FormControl<string | null>;
  dealer?: FormControl<string | null>;
  visualInspectionAfterUsage: FormControl<boolean>;
}

@Component({
  selector: 'ofs-device-type-detail',
  imports: [
    NgIf, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzPopconfirmModule, NzSelectModule, NzInputNumberModule
  ],
  standalone: true,
  templateUrl: './device-type-detail.component.html',
  styleUrl: './device-type-detail.component.less'
})
export class DeviceTypeDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;

  private destroy$ = new Subject<void>();

  form = new FormGroup<DeviceTypeDetailForm>({
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: DeviceTypeDetailService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.notFound = this.service.notFound;
    this.loading = this.service.loading;
    this.loadingError = this.service.loadingError;
    this.deleteLoading = this.service.deleteLoading;
    this.updateLoading = this.service.updateLoading;

    effect(() => {
      const entity = this.service.entity();
      if (entity) this.form.patchValue(entity);
    });

    effect(() => {
      const updateLoading = this.service.loadingError();
      if (updateLoading) {
        this.inAppMessagingService.showError('Fehler beim laden des Geräte-Typs.');
      }
    });

    this.service.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.service.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Geräte-Typ gelöscht'));
    this.service.updateLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showError('Fehler beim speichern.'));
    this.service.updateLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.service.load(params['id']);
    });
  }

  submit() {
    this.service.update(this.form.getRawValue());
  }

  delete() {
    this.service.delete();
  }
}
