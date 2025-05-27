import {Component, OnDestroy, Signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {Subject, takeUntil} from 'rxjs';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {LocationCreateService} from './location-create.service';
import {NzOptionComponent, NzSelectComponent} from 'ng-zorro-antd/select';
import {NzSpinComponent} from 'ng-zorro-antd/spin';
import {LocationTypes} from '../location-types';
import {LocationDto} from '@backend/model/locationDto';

interface LocationCreateForm {
  name: FormControl<string>;
  description: FormControl<string | null>;
  type: FormControl<number>;
  parentId: FormControl<number | null>;
}

@Component({
  selector: 'ofs-location-create',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzOptionComponent, NzSelectComponent, NzSpinComponent],
  standalone: true,
  templateUrl: './location-create.component.html',
  styleUrl: './location-create.component.less'
})
export class LocationCreateComponent implements OnDestroy {
  types = LocationTypes.all;

  parentsIsLoading: Signal<boolean>;
  parents: Signal<LocationDto[]>;
  form = new FormGroup<LocationCreateForm>({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    }),
    description: new FormControl<string>('', {
      validators: [Validators.maxLength(2000)]
    }),
    type: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    parentId: new FormControl<number | null>(null, {
      validators: [],
    }),
  });

  createLoading: Signal<boolean>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly service: LocationCreateService,
    private readonly inAppMessagingService: InAppMessageService
  ) {
    this.createLoading = this.service.createLoading;
    this.parentsIsLoading = this.service.parentsIsLoading;
    this.parents = this.service.parents;

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

  onSearchParent(search: string) {
    this.service.onSearchParent(search);
  }
}
