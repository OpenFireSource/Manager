import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {ConsumableDetailService} from './consumable-detail.service';
import {NgIf} from '@angular/common';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzSelectModule} from 'ng-zorro-antd/select';

import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';

interface ConsumableUpdateForm {
  name: FormControl<string>;
  notice: FormControl<string | null>;
  groupId: FormControl<number | null>;
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
  ],
  templateUrl: './consumable-detail.component.html',
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

  consumableGroups: Signal<ConsumableGroupDto[]>;
  consumableGroupsIsLoading: Signal<boolean>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly service: ConsumableDetailService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.notFound = this.service.notFound;
    this.loading = this.service.loading;
    this.loadingError = this.service.loadingError;
    this.deleteLoading = this.service.deleteLoading;
    this.updateLoading = this.service.updateLoading;

    this.consumableGroups = this.service.consumableGroups;
    this.consumableGroupsIsLoading = this.service.consumableGroupsIsLoading;

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
}
