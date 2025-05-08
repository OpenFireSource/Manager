import {Component, computed, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {NgIf} from '@angular/common';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {GroupDetailService} from './group-detail.service';
import {Subject, takeUntil} from 'rxjs';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTransferModule, TransferChange, TransferItem} from 'ng-zorro-antd/transfer';

interface GroupDetailForm {
  name: FormControl<string>;
}

@Component({
  selector: 'ofs-group-detail',
  imports: [
    NgIf,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzPopconfirmModule,
    NzTabsModule,
    NzTableModule,
    NzTransferModule,
  ],
  standalone: true,
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.less'
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;
  users: Signal<TransferItem[]>
  usersTransferLoading: Signal<boolean>;
  roles: Signal<TransferItem[]>
  rolesTransferLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];

  form = new FormGroup<GroupDetailForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(70)]
    }),
  });

  constructor(
    private readonly groupDetailService: GroupDetailService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.notFound = this.groupDetailService.notFound;
    this.loading = this.groupDetailService.loading;
    this.loadingError = this.groupDetailService.loadingError;
    this.deleteLoading = this.groupDetailService.deleteLoading;
    this.usersTransferLoading = this.groupDetailService.usersTransferLoading;
    this.users = computed(() => this.groupDetailService.users().map((item) => ({
      title: item.user.lastName + ' ' + item.user.firstName,
      direction: item.member ? 'right' : 'left',
      key: item.user.id,
    } as TransferItem)));
    this.rolesTransferLoading = this.groupDetailService.rolesTransferLoading;
    this.roles = computed(() => this.groupDetailService.roles().map((item) => ({
      title: item.role.description,
      direction: item.hasRole ? 'right' : 'left',
      key: item.role.name,
    } as TransferItem)));


    this.updateLoading = this.groupDetailService.updateLoading;
    effect(() => {
      const group = this.groupDetailService.group();
      if (group) this.form.patchValue(group);
    });

    effect(() => {
      const updateLoading = this.groupDetailService.loadingError();
      if (updateLoading) {
        this.inAppMessagingService.showError('Fehler beim laden des Benutzers.');
      }
    });

    this.groupDetailService.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.groupDetailService.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Gruppe gelöscht'));
    this.groupDetailService.updateLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showError('Fehler beim speichern.'));
    this.groupDetailService.updateLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.groupDetailService.load(params['id']);
    });
  }

  submit() {
    this.groupDetailService.update(this.form.getRawValue());
  }

  delete() {
    this.groupDetailService.delete();
  }

  changeMembers(ret: TransferChange): void {
    this.groupDetailService.updateMembers(ret.from === "left", ret.list.map((item) => item['key']));
  }

  changeRole(ret: TransferChange) {
    this.groupDetailService.updateRoles(ret.from === "left", ret.list.map((item) => item['key']));
  }
}
