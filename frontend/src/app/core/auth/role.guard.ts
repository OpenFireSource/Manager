import {CanActivateFn, RedirectCommand, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export function roleGuard(roles: string[], validation?: 'all' | 'one'): CanActivateFn {
  return () => {
    const authService: AuthService = inject(AuthService);

    const userRoles = authService.userRoles;
    // keine Rollen oder nicht authentifiziert
    if (userRoles.length === 0) return false;

    // alle Rollen müssen übereinstimmen
    const response = !validation || validation === 'all' ?
      roles.every((role => userRoles.includes(role))) :
      roles.some((role => userRoles.includes(role)));
    if (response) return true;

    const router = inject(Router);
    const urlTree = router.parseUrl('/access-denied');

    return new RedirectCommand(urlTree, {skipLocationChange: true});
  };
}
