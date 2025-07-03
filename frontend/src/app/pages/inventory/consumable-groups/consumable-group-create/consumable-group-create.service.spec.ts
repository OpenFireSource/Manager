import { TestBed } from '@angular/core/testing';

import { ConsumableGroupCreateService } from './consumable-group-create.service';

describe('ConsumableGroupCreateService', () => {
  let service: ConsumableGroupCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumableGroupCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
