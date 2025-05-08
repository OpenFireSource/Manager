import { TestBed } from '@angular/core/testing';

import { DeviceTypeDetailService } from './device-type-detail.service';

describe('DeviceTypeDetailService', () => {
  let service: DeviceTypeDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceTypeDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
