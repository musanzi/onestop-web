import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { SignInParamsInterface, SignInStoreInterface } from '../interfaces/sign-in-store.interface';
import { SignInService } from '../services/sign-in.service';

export const SignInStore = signalStore(
  withState<SignInStoreInterface>({
    isLoading: false,
  }),
  withProps(() => ({
    _signInService: inject(SignInService),
  })),
  withMethods(({ _signInService, ...store }) => ({
    signIn: rxMethod<SignInParamsInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, redirectPath, onSuccess }) =>
          _signInService.signIn(payload, redirectPath).pipe(
            tap({
              next: () => {
                patchState(store, { isLoading: false });
                onSuccess();
              },
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
  })),
);
