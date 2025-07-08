import { TestBed } from '@angular/core/testing';

import { ConsumableDetailService } from './consumable-detail.service';

describe('ConsumableDetailService', () => {
  let service: ConsumableDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumableDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
