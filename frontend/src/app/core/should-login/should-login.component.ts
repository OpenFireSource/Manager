import { Component } from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'ofs-should-login',
  imports: [],
  standalone: true,
  templateUrl: './should-login.component.html',
  styleUrl: './should-login.component.less'
})
export class ShouldLoginComponent {
  constructor(private authService: OAuthService) { }

  public login($event: MouseEvent) {
    $event.preventDefault();
    this.authService.initLoginFlow();
  }
}
