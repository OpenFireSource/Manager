import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuardWithForcedLoginGuard } from './auth-guard-with-forced-login.guard';

describe('authGuardWithForcedLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuardWithForcedLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
