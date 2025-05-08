import {Route} from '@angular/router';
import {LocationsComponent} from './locations/locations.component';
import {roleGuard} from '../../core/auth/role.guard';
import {LocationDetailComponent} from './locations/location-detail/location-detail.component';
import {LocationCreateComponent} from './locations/location-create/location-create.component';

export const ROUTES: Route[] = [
  {
    path: 'locations',
    component: LocationsComponent,
    canActivate: [roleGuard(['location.view'])],
  },
  {
    path: 'locations/create',
    component: LocationCreateComponent,
    canActivate: [roleGuard(['location.manage'])],
  },
  {
    path: 'locations/:id',
    component: LocationDetailComponent,
    canActivate: [roleGuard(['location.manage'])],
  },
];
