import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { FilterVenturesInterface } from '../interfaces/filter-ventures.interface';
import { VenturesStoreInterface } from '../interfaces/ventures-store.interface';
import { VenturesService } from '../services/ventures.service';

export const VenturesStore = signalStore(
  withState<VenturesStoreInterface>({
    isLoading: false,
    ventures: [[], 0],
    venture: null,
  }),
  withProps(() => ({
    _venturesService: inject(VenturesService),
  })),
  withMethods(({ _venturesService, ...store }) => ({
    loadAll: rxMethod<FilterVenturesInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((filters) =>
          _venturesService.getAll(filters).pipe(
            tap({
              next: (ventures) => patchState(store, { isLoading: false, ventures }),
            }),
            catchError(() => {
              patchState(store, { ventures: [[], 0] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    loadOne: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) =>
          _venturesService.getOne(slug).pipe(
            tap({
              next: (venture) => patchState(store, { isLoading: false, venture }),
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    togglePublish: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((slug) =>
          _venturesService.togglePublish(slug).pipe(
            tap({
              next: (data) => {
                const [list, count] = store.ventures();
                const updated = list.map((v) => (v.slug === data.slug ? data : v));
                patchState(store, { isLoading: false, ventures: [updated, count], venture: data });
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
