import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {DeviceGroupDetailService} from './device-group-detail.service';

interface DeviceGroupDetailForm {
  name: FormControl<string>;
  notice?: FormControl<string | null>;
}

@Component({
  selector: 'ofs-device-group-detail',
  imports: [NgIf, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzPopconfirmModule, NzSelectModule, NzInputNumberModule
  ],
  standalone: true,
  templateUrl: './device-group-detail.component.html',
  styleUrl: './device-group-detail.component.less'
})
export class DeviceGroupDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;

  private destroy$ = new Subject<void>();

  form = new FormGroup<DeviceGroupDetailForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
  });

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: DeviceGroupDetailService,
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
        this.inAppMessagingService.showError('Fehler beim laden der Geräte-Gruppe.');
      }
    });

    this.service.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.service.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Geräte-Gruppe gelöscht'));
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
