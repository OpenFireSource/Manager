import {Component, OnInit, TemplateRef} from '@angular/core';
import {RouterLink, RouterModule, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {AuthService} from './core/auth/auth.service';
import {HasRoleDirective} from './core/auth/has-role.directive';
import {IsNotAuthenticatedDirective} from './core/auth/is-not-authenticated.directive';
import {IsAuthenticatedDirective} from './core/auth/is-authenticated.directive';
import {NewsService} from './core/news/news.service';
import {NzModalModule, NzModalService} from 'ng-zorro-antd/modal';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NewsComponent} from './core/news/news.component';

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
    NzModalModule,
    NzButtonModule,
    NewsComponent,
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  isCollapsed = false;

  constructor(
    private authService: AuthService,
    private newsService: NewsService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.newsService.load();
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

  openNews(tplTitle: TemplateRef<object>, tplContent: TemplateRef<object>, tplFooter: TemplateRef<object>) {
    this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true,
      nzWidth: '80%',
    });
  }

}
