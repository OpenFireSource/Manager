import { TestBed } from '@angular/core/testing';

import { ConsumableGroupDetailService } from './consumable-group-detail.service';

describe('ConsumableGroupDetailService', () => {
  let service: ConsumableGroupDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumableGroupDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
