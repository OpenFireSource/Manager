import {Routes} from '@angular/router';
import {FallbackComponent} from './core/fallback/fallback.component';
import {ShouldLoginComponent} from './core/should-login/should-login.component';
import {AccessDeniedComponent} from './core/access-denied/access-denied.component';
import {authGuardWithForcedLoginGuard} from './core/auth/auth-guard-with-forced-login.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'basics/home', pathMatch: 'full'},
  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.routes').then(m => m.ROUTES),
    canActivate: [authGuardWithForcedLoginGuard],
  },
  {
    path: 'base',
    loadChildren: () => import('./pages/base/base.routes').then(m => m.ROUTES),
    canActivate: [authGuardWithForcedLoginGuard],
  },
  {
    path: 'inventory',
    loadChildren: () => import('./pages/inventory/inventory.routes').then(m => m.ROUTES),
    canActivate: [authGuardWithForcedLoginGuard],
  },
  {path: 'should-login', component: ShouldLoginComponent},
  {path: 'access-denied', component: AccessDeniedComponent},
  {path: '**', component: FallbackComponent},
];
