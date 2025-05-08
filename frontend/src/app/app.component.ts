import {Component} from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {AuthService} from './core/auth/auth.service';
import {HasRoleDirective} from './core/auth/has-role.directive';
import {IsNotAuthenticatedDirective} from './core/auth/is-not-authenticated.directive';
import {IsAuthenticatedDirective} from './core/auth/is-authenticated.directive';

@Component({
  selector: 'ofs-root',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    HasRoleDirective,
    IsNotAuthenticatedDirective,
    IsAuthenticatedDirective,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  isCollapsed = false;

  constructor(private authService: AuthService) {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  get name(): string {
    return this.authService.identityClaims
      ? (this.authService.identityClaims)['name']
      : '-';
  }
}
