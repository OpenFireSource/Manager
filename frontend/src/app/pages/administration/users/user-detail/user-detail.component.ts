import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserDetailService} from './user-detail.service';
import {NgIf} from '@angular/common';
import {NzInputModule} from 'ng-zorro-antd/input';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {Subject, takeUntil} from 'rxjs';

interface UserDetailForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  emailVerified: FormControl<boolean>;
  enabled: FormControl<boolean>;
}

@Component({
  selector: 'ofs-user-detail',
  imports: [NgIf, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzPopconfirmModule],
  standalone: true,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.less'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  form = new FormGroup<UserDetailForm>({
    firstName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(30)]
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly userDetailService: UserDetailService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.notFound = this.userDetailService.notFound;
    this.loading = this.userDetailService.loading;
    this.loadingError = this.userDetailService.loadingError;
    this.deleteLoading = this.userDetailService.deleteLoading;

    this.updateLoading = this.userDetailService.updateLoading;
    effect(() => {
      const user = this.userDetailService.user();
      if (user) this.form.patchValue(user);
    });

    effect(() => {
      const updateLoading = this.userDetailService.loadingError();
      if (updateLoading) {
        this.inAppMessagingService.showError('Fehler beim laden des Benutzers.');
      }
    });

    this.userDetailService.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.userDetailService.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Benutzer gelöscht'));
    this.userDetailService.updateLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showError('Fehler beim speichern.'));
    this.userDetailService.updateLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userDetailService.load(params['id']);
    });
  }

  submit() {
    this.userDetailService.update(this.form.getRawValue());
  }

  delete() {
    this.userDetailService.delete();
  }
}
