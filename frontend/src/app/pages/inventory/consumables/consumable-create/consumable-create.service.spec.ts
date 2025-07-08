import { TestBed } from '@angular/core/testing';

import { ConsumableCreateService } from './consumable-create.service';

describe('ConsumableCreateService', () => {
  let service: ConsumableCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumableCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
