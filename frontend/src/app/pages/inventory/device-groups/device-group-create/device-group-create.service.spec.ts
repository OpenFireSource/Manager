import { TestBed } from '@angular/core/testing';

import { DeviceGroupCreateService } from './device-group-create.service';

describe('DeviceGroupCreateService', () => {
  let service: DeviceGroupCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceGroupCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
