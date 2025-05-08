import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {UserCreateService} from './user-create.service';
import {Subject, takeUntil} from 'rxjs';

interface UserCreateForm {
  username: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  emailVerified: FormControl<boolean>;
  enabled: FormControl<boolean>;
}

@Component({
  selector: 'ofs-user-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule],
  standalone: true,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.less'
})
export class UserCreateComponent implements OnDestroy {
  form = new FormGroup<UserCreateForm>({
    username: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9_\-.]{1,28}[a-zA-Z0-9]$/)]
    }),
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(40)]
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(40)]
    }),
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    emailVerified: new FormControl<boolean>(false, {nonNullable: true,}),
    enabled: new FormControl<boolean>(false, {nonNullable: true,}),
  });

  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly userCreateService: UserCreateService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.createLoading = this.userCreateService.createLoading;

    this.userCreateService.createLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.userCreateService.createLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  submit() {
    this.userCreateService.create(this.form.getRawValue());
  }
}
