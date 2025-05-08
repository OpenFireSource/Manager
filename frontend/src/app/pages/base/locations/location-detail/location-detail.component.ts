import {Component, effect, OnDestroy, OnInit, Signal} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {InAppMessageService} from '../../../../shared/services/in-app-message.service';
import {LocationDetailService} from './location-detail.service';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {LocationDto} from '@backend/model/locationDto';
import {LocationTypes} from '../location-types';

interface LocationDetailForm {
  name: FormControl<string>;
  description: FormControl<string | null>;
  type: FormControl<number>;
  parentId: FormControl<number | null>;
}

@Component({
  selector: 'ofs-location-detail',
  imports: [NgIf, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCheckboxModule, NzPopconfirmModule, NzSelectModule, NzSpinModule],
  standalone: true,
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.less'
})
export class LocationDetailComponent implements OnInit, OnDestroy {
  types = LocationTypes.all;

  notFound: Signal<boolean>;
  loading: Signal<boolean>;
  loadingError: Signal<boolean>;
  updateLoading: Signal<boolean>;
  deleteLoading: Signal<boolean>;
  parentsIsLoading: Signal<boolean>;
  parents: Signal<LocationDto[]>;
  private destroy$ = new Subject<void>();

  form = new FormGroup<LocationDetailForm>({
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly locationDetailService: LocationDetailService,
    private readonly inAppMessagingService: InAppMessageService,
  ) {
    this.notFound = this.locationDetailService.notFound;
    this.loading = this.locationDetailService.loading;
    this.loadingError = this.locationDetailService.loadingError;
    this.deleteLoading = this.locationDetailService.deleteLoading;
    this.updateLoading = this.locationDetailService.updateLoading;
    this.parentsIsLoading = this.locationDetailService.parentsIsLoading;
    this.parents = this.locationDetailService.parents;

    effect(() => {
      const location = this.locationDetailService.location();
      if (location) this.form.patchValue(location);
    });

    effect(() => {
      const updateLoading = this.locationDetailService.loadingError();
      if (updateLoading) {
        this.inAppMessagingService.showError('Fehler beim laden des Orts/Fahrzeugs.');
      }
    });

    this.locationDetailService.deleteLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => this.inAppMessagingService.showError(x));
    this.locationDetailService.deleteLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Ort/Fahrzeug gelöscht'));
    this.locationDetailService.updateLoadingError
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showError('Fehler beim speichern.'));
    this.locationDetailService.updateLoadingSuccess
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.inAppMessagingService.showSuccess('Änderungen gespeichert'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.locationDetailService.load(params['id']);
    });
  }

  submit() {
    this.locationDetailService.update(this.form.getRawValue());
  }

  delete() {
    this.locationDetailService.delete();
  }

  loadMore() {
    this.locationDetailService.loadParents();
  }
}
