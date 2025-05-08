import {Route} from '@angular/router';
import {UsersComponent} from './users/users.component';
import {GroupsComponent} from './groups/groups.component';
import {roleGuard} from '../../core/auth/role.guard';
import {UserDetailComponent} from './users/user-detail/user-detail.component';
import {UserCreateComponent} from './users/user-create/user-create.component';
import {GroupDetailComponent} from './groups/group-detail/group-detail.component';
import {GroupCreateComponent} from './groups/group-create/group-create.component';

export const ROUTES: Route[] = [
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [roleGuard(['user.view'])],
  },
  {
    path: 'users/create',
    component: UserCreateComponent,
    canActivate: [roleGuard(['user.manage'])],
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    canActivate: [roleGuard(['user.manage'])],
  },
  {
    path: 'groups',
    component: GroupsComponent,
    canActivate: [roleGuard(['group.view'])],
  },
  {
    path: 'groups/create',
    component: GroupCreateComponent,
    canActivate: [roleGuard(['group.manage'])],
  },
  {
    path: 'groups/:id',
    component: GroupDetailComponent,
    canActivate: [roleGuard(['group.manage'])],
  },
];
