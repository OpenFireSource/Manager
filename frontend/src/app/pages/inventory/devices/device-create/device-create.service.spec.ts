import { TestBed } from '@angular/core/testing';

import { DeviceCreateService } from './device-create.service';

describe('DeviceCreateService', () => {
  let service: DeviceCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
