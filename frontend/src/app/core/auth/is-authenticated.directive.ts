import {Directive, effect, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';

@Directive({
  standalone: true,
  selector: '[ofsIsAuthenticated]'
})
export class IsAuthenticatedDirective {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,) {
    this.viewContainer.clear();

    effect(() => {
      const authenticated = this.authService.isAuthenticated();
      if (authenticated) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
