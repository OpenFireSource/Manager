import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';

export const SEARCH_DEBOUNCE_TIME = new InjectionToken<string>('SEARCH_DEBOUNCE_TIME');

export function provideAppConfigs(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SEARCH_DEBOUNCE_TIME,
      useValue: 300,
    }
  ]);
}
