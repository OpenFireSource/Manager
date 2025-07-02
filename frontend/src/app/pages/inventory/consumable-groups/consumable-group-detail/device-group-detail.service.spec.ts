import { TestBed } from '@angular/core/testing';

import { DeviceGroupDetailService } from './device-group-detail.service';

describe('DeviceGroupDetailService', () => {
  let service: DeviceGroupDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceGroupDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
