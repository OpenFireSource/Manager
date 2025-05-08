import {CanActivateFn} from '@angular/router';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  return authService.canActivateProtectedRoutes$;
};
