import { TestBed } from '@angular/core/testing';

import { LocationCreateService } from './location-create.service';

describe('LocationCreateService', () => {
  let service: LocationCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
