import {EnvironmentProviders, InjectionToken, makeEnvironmentProviders} from '@angular/core';

export const SEARCH_DEBOUNCE_TIME = new InjectionToken<string>('SEARCH_DEBOUNCE_TIME');
export const SELECT_ITEMS_COUNT = new InjectionToken<string>('SELECT_ITEMS_COUNT');

export function provideAppConfigs(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SEARCH_DEBOUNCE_TIME,
      useValue: 300,
    },
    {
      provide: SELECT_ITEMS_COUNT,
      useValue: 20,
    },
  ]);
}
