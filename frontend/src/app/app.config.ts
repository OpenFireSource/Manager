import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom, provideAppInitializer, inject,
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {icons} from './icons-provider';
import {provideNzIcons} from 'ng-zorro-antd/icon';
import {de_DE, NZ_DATE_LOCALE, provideNzI18n} from 'ng-zorro-antd/i18n';
import de from '@angular/common/locales/de';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {BASE_PATH} from '@backend/variables';
import {AuthConfig, OAuthStorage, provideOAuthClient} from 'angular-oauth2-oidc';
import {authAppInitializerFactory} from './core/auth/auth-app-initializer.factory';
import {AuthService} from './core/auth/auth.service';
import {authConfig} from './core/auth/auth-config';
import {authModuleConfig} from './core/auth/auth-module-config';
import {de as deDE} from 'date-fns/locale';
import {registerLocaleData} from '@angular/common';
import {provideAppConfigs} from './app.configs';

registerLocaleData(de);

// We need a factory since localStorage is not available at AOT build time
export function storageFactory(): OAuthStorage {
  return localStorage;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const initializerFn = (authAppInitializerFactory)(inject(AuthService));
      return initializerFn();
    }),
    {provide: AuthConfig, useValue: authConfig},
    {provide: OAuthStorage, useFactory: storageFactory},
    {provide: NZ_DATE_LOCALE, useValue: deDE},
    provideNzI18n(de_DE),
    provideOAuthClient(authModuleConfig),
    provideHttpClient(withInterceptorsFromDi()),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideNzIcons(icons),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    {provide: BASE_PATH, useValue: ''},
    provideAppConfigs(),
  ]
};
