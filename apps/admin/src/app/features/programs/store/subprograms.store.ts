import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, finalize, pipe, switchMap, tap } from 'rxjs';
import { SubprogramInterface } from '../interfaces/subprogram.interface';
import { SubprogramsStoreInterface } from '../interfaces/subprograms-store.interface';
import { SubprogramsService } from '../services/subprograms.service';

export const SubprogramsStore = signalStore(
  withState<SubprogramsStoreInterface>({ isLoading: false, subprograms: [] }),
  withProps(() => ({
    _subprogramsService: inject(SubprogramsService),
  })),
  withMethods(({ _subprogramsService, ...store }) => ({
    loadAll: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _subprogramsService.getAll(id).pipe(
            tap({
              next: (subprograms) => patchState(store, { isLoading: false, subprograms }),
            }),
            catchError(() => {
              patchState(store, { subprograms: [] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    create: rxMethod<{ payload: SubprogramInterface; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) =>
          _subprogramsService.create(payload).pipe(
            tap({
              next: (data) => {
                const list = store.subprograms();
                patchState(store, { subprograms: [data, ...list] });
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
    update: rxMethod<{ payload: SubprogramInterface; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ payload, onSuccess }) =>
          _subprogramsService.update(payload).pipe(
            tap({
              next: (data) => {
                const list = store.subprograms();
                const updated = list.map((sp) => (sp.id === data.id ? data : sp));
                patchState(store, { subprograms: updated });
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
    delete: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _subprogramsService.delete(id).pipe(
            tap({
              next: () => {
                const list = store.subprograms();
                const filtered = list.filter((subprogram) => subprogram.id !== id);
                patchState(store, { subprograms: filtered, isLoading: false });
              },
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    publish: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _subprogramsService.publish(id).pipe(
            tap({
              next: (data) => {
                const list = store.subprograms();
                const updated = list.map((sp) => (sp.id === data.id ? data : sp));
                patchState(store, { subprograms: updated, isLoading: false });
              },
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    showcase: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _subprogramsService.showcase(id).pipe(
            tap({
              next: (data) => {
                const list = store.subprograms();
                const updated = list.map((sp) => (sp.id === data.id ? data : sp));
                patchState(store, { subprograms: updated });
                patchState(store, { isLoading: false });
              },
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    loadUnpaginated: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        exhaustMap(() =>
          _subprogramsService.getAllUnpaginated().pipe(
            tap({
              next: (subprograms) => patchState(store, { isLoading: false, subprograms }),
            }),
            catchError(() => {
              patchState(store, { subprograms: [] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
  })),
);
