import { TestBed } from '@angular/core/testing';

import { GroupCreateService } from './group-create.service';

describe('GroupCreateService', () => {
  let service: GroupCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
