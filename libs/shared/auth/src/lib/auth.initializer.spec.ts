import { describe, it, expect } from 'vitest';
import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideAuthInitializer } from './auth.initializer';
import { AuthStore } from './auth-store';

describe('provideAuthInitializer', () => {
  it('invokes AuthStore.initializeSession during app startup', async () => {
    const authStoreSpy = jasmine.createSpyObj<AuthStore>('AuthStore', ['initializeSession']);
    authStoreSpy.initializeSession.and.returnValue(of(void 0));

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthStore,
          useValue: authStoreSpy,
        },
        provideAuthInitializer(),
      ],
    });

    const initializers = TestBed.inject(APP_INITIALIZER) as Array<() => unknown>;
    await Promise.resolve(initializers[0]());

    expect(authStoreSpy.initializeSession).toHaveBeenCalledTimes(1);
  });
});
