import {CanActivateFn} from '@angular/router';
import {filter, map, Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';

export const authGuardWithForcedLoginGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const authService = inject(AuthService);
  return authService.isDoneLoading$.pipe(
    filter(isDone => isDone),
    map(() => authService.isAuthenticated()),
    tap(isAuthenticated => isAuthenticated || authService.login(state.url)),
  );
}
