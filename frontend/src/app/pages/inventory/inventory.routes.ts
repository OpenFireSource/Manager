import {Route} from '@angular/router';
import {roleGuard} from '../../core/auth/role.guard';
import {DeviceTypesComponent} from './device-types/device-types.component';
import {DeviceTypeCreateComponent} from './device-types/device-type-create/device-type-create.component';
import {DeviceTypeDetailComponent} from './device-types/device-type-detail/device-type-detail.component';
import {DeviceGroupsComponent} from './device-groups/device-groups.component';
import {DeviceGroupCreateComponent} from './device-groups/device-group-create/device-group-create.component';
import {DeviceGroupDetailComponent} from './device-groups/device-group-detail/device-group-detail.component';
import { DevicesComponent } from './devices/devices.component';
import {DeviceCreateComponent} from './devices/device-create/device-create.component';
import {DeviceDetailComponent} from './devices/device-detail/device-detail.component';

export const ROUTES: Route[] = [
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [roleGuard(['device.view'])],
  },
  {
    path: 'devices/create',
    component: DeviceCreateComponent,
    canActivate: [roleGuard(['device.manage'])],
  },
  {
    path: 'devices/:id',
    component: DeviceDetailComponent,
    canActivate: [roleGuard(['device.manage'])],
  },
  {
    path: 'device-types',
    component: DeviceTypesComponent,
    canActivate: [roleGuard(['device-type.view'])],
  },
  {
    path: 'device-types/create',
    component: DeviceTypeCreateComponent,
    canActivate: [roleGuard(['device-type.manage'])],
  },
  {
    path: 'device-types/:id',
    component: DeviceTypeDetailComponent,
    canActivate: [roleGuard(['device-type.manage'])],
  },
  {
    path: 'device-groups',
    component: DeviceGroupsComponent,
    canActivate: [roleGuard(['device-group.view'])],
  },
  {
    path: 'device-groups/create',
    component: DeviceGroupCreateComponent,
    canActivate: [roleGuard(['device-group.manage'])],
  },
  {
    path: 'device-groups/:id',
    component: DeviceGroupDetailComponent,
    canActivate: [roleGuard(['device-group.manage'])],
  },
];
