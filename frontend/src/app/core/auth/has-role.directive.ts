import {Directive, effect, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from './auth.service';

@Directive({
  standalone: true,
  selector: '[ofsHasRole]'
})
export class HasRoleDirective {
  @Input('ofsHasRole') roles?: string[];

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) {
    this.viewContainer.clear();

    effect(() => {
      const authenticated = this.authService.isAuthenticated();
      this.render(authenticated);
    });
  }

  private render(authnticated: boolean): void {
    if (authnticated && this.checkUserRoles()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }


  /**
   * Prüft, ob der Benutzer mindestens eine der angegebenen Rollen hat.
   */
  private checkUserRoles(): boolean {
    const userRoles = this.authService.userRoles;
    return this.roles?.some((role => userRoles.includes(role))) ?? false;
  }
}
