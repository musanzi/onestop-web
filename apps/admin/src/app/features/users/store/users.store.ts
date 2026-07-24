import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { FilterUsersInterface } from '../interfaces/filter-users.interface';
import { UserInterface } from '../interfaces/user.interface';
import { UsersStoreInterface } from '../interfaces/users-store.interface';
import { UsersService } from '../services/users.service';

export const UsersStore = signalStore(
  withState<UsersStoreInterface>({
    isLoading: false,
    isUpdating: false,
    isImportingCsv: false,
    isDownloading: false,
    users: [[], 0],
    user: null,
    staff: []
  }),
  withProps(() => ({
    _usersService: inject(UsersService)
  })),
  withMethods(({ _usersService, ...store }) => ({
    loadAll: rxMethod<FilterUsersInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((filters) =>
          _usersService.getAll(filters).pipe(
            tap({
              next: (users) => patchState(store, { isLoading: false, users })
            }),
            catchError(() => {
              patchState(store, { users: [[], 0] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    loadStaff: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          _usersService.getStaff().pipe(
            tap({
              next: (staff) => patchState(store, { isLoading: false, staff })
            }),
            catchError(() => {
              patchState(store, { staff: [] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    loadOne: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((email) =>
          _usersService.getOne(email).pipe(
            tap({
              next: (user) => patchState(store, { isLoading: false, user })
            }),
            catchError(() => {
              patchState(store, { user: null });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    create: rxMethod<UserInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((dto) =>
          _usersService.create(dto).pipe(
            tap({
              next: (user) => patchState(store, { isLoading: false, user })
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    update: rxMethod<{ id: string; dto: UserInterface }>(
      pipe(
        tap(() => patchState(store, { isUpdating: true })),
        switchMap((params) =>
          _usersService.update(params.id, params.dto).pipe(
            tap({
              next: (user) => patchState(store, { isUpdating: false, user })
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isUpdating: false }))
          )
        )
      )
    ),
    delete: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((userId) =>
          _usersService.delete(userId).pipe(
            tap({
              next: () => {
                const [list, count] = store.users();
                const filtered = list.filter((u) => u.id !== userId);
                patchState(store, { isLoading: false, users: [filtered, Math.max(0, count - 1)] });
              }
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    download: rxMethod<FilterUsersInterface>(
      pipe(
        tap(() => patchState(store, { isDownloading: true })),
        switchMap((queryParams) =>
          _usersService.download(queryParams).pipe(
            tap({
              next: () => patchState(store, { isDownloading: false })
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isDownloading: false }))
          )
        )
      )
    ),
    importCsv: rxMethod<{ file: File; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isImportingCsv: true })),
        switchMap(({ file, onSuccess }) =>
          _usersService.importCsv(file).pipe(
            tap({
              next: () => {
                patchState(store, { isImportingCsv: false });
                onSuccess();
              }
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isImportingCsv: false }))
          )
        )
      )
    )
  }))
);
