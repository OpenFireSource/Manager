import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {Subject, takeUntil} from 'rxjs';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {ConsumableGroupCreateService} from './consumable-group-create.service';

interface ConsumableGroupCreateForm {
  name: FormControl<string>;
  notice?: FormControl<string | null>;
}

@Component({
  selector: 'ofs-consumable-group-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  standalone: true,
  templateUrl: './consumable-group-create.component.html',
  styleUrl: './consumable-group-create.component.less'
})
export class ConsumableGroupCreateComponent implements OnDestroy {
  form = new FormGroup<ConsumableGroupCreateForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    notice: new FormControl<string | null>('', {
      validators: [Validators.maxLength(2000)]
    }),
  });

  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly service: ConsumableGroupCreateService,
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
