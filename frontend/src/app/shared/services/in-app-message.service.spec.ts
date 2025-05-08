import { TestBed } from '@angular/core/testing';

import { InAppMessageService } from './in-app-message.service';

describe('InAppMessageService', () => {
  let service: InAppMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InAppMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
