import { TestBed } from '@angular/core/testing';

import { DeviceTypeCreateService } from './device-type-create.service';

describe('DeviceTypeCreateService', () => {
  let service: DeviceTypeCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceTypeCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
