import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthStore } from './auth-store';

export function provideAuthInitializer(): Provider {
  return {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [AuthStore],
    useFactory: (authStore: AuthStore) => () => firstValueFrom(authStore.initializeSession()),
  };
}
