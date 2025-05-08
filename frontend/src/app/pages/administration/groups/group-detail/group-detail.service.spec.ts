import { TestBed } from '@angular/core/testing';

import { GroupDetailService } from './group-detail.service';

describe('GroupDetailService', () => {
  let service: GroupDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
