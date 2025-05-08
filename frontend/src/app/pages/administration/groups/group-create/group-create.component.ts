import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {GroupCreateService} from './group-create.service';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {Subject, takeUntil} from 'rxjs';

interface GroupCreateForm {
  name: FormControl<string>;
}

@Component({
  selector: 'ofs-group-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule],
  standalone: true,
  templateUrl: './group-create.component.html',
  styleUrl: './group-create.component.less'
})
export class GroupCreateComponent implements OnDestroy {
form = new FormGroup<GroupCreateForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(70)]
    }),
  });

  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly groupCreateService: GroupCreateService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.createLoading = this.groupCreateService.createLoading;

    this.groupCreateService.createLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.groupCreateService.createLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submit() {
    this.groupCreateService.create(this.form.getRawValue());
  }
}
