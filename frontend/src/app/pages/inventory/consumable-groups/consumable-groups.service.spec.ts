import { TestBed } from '@angular/core/testing';

import { DeviceGroupsService } from './device-groups.service';

describe('DeviceGroupsService', () => {
  let service: DeviceGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
