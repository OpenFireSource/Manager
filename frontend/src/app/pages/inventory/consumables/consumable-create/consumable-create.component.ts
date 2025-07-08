import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {ConsumableCreateService} from './consumable-create.service';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzFormModule} from 'ng-zorro-antd/form';
import {ConsumableGroupDto} from '@backend/model/consumableGroupDto';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzIconModule} from 'ng-zorro-antd/icon';

interface ConsumableCreateForm {
  name: FormControl<string>;
  notice: FormControl<string | null>;
  groupId: FormControl<number | null>;
}

@Component({
  selector: 'ofs-consumable-create',
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzGridModule,
    NzFormModule,
    ReactiveFormsModule,
    NzOptionComponent,
    NzSelectComponent,
    NzIconModule,
  ],
  templateUrl: './consumable-create.component.html',
  styleUrl: './consumable-create.component.less'
})
export class ConsumableCreateComponent implements OnDestroy {
  form = new FormGroup<ConsumableCreateForm>({
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
  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly service: ConsumableCreateService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.createLoading = this.service.createLoading;
    this.consumableGroups = this.service.consumableGroups;
    this.consumableGroupsIsLoading = this.service.consumableGroupsIsLoading;

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

  onSearchGroup(search: string) {
    this.service.onSearchGroup(search);
  }
}
