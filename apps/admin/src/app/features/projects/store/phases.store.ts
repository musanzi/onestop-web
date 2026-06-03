import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { PhaseInterface } from '../interfaces/phase.interface';
import { IPhasesStoreInterface } from '../interfaces/phases-store.interface';
import { PhasesService } from '../services/phases.service';

export const PhasesStore = signalStore(
  withState<IPhasesStoreInterface>({
    isLoading: false,
    isMentorsLoading: false,
    phases: [],
    phase: null,
    mentors: [],
  }),
  withComputed(({ phases }) => ({
    sortedPhases: computed(() =>
      phases().sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime()),
    ),
  })),
  withProps(() => ({
    _phasesService: inject(PhasesService),
  })),
  withMethods(({ _phasesService, ...store }) => ({
    loadAll: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) =>
          _phasesService.getAll(id).pipe(
            tap({
              next: (phases) => patchState(store, { isLoading: false, phases }),
            }),
            catchError(() => {
              patchState(store, { phases: [] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    loadMentors: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isMentorsLoading: true })),
        switchMap(() =>
          _phasesService.getMentors().pipe(
            tap({
              next: (mentors) => patchState(store, { isMentorsLoading: false, mentors }),
            }),
            catchError(() => {
              patchState(store, { mentors: [] });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isMentorsLoading: false })),
          ),
        ),
      ),
    ),
    create: rxMethod<{ projectId: string; dto: PhaseInterface; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ dto, projectId, onSuccess }) =>
          _phasesService.create(projectId, dto).pipe(
            tap({
              next: (data) => {
                const phases = [...store.phases(), data];
                patchState(store, { isLoading: false, phases, phase: data });
                onSuccess();
              },
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false })),
          ),
        ),
      ),
    ),
    update: rxMethod<{ dto: PhaseInterface & { id: string }; onSuccess: () => void }>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(({ dto, onSuccess }) =>
          _phasesService.update(dto).pipe(
            tap({
              next: (data) => {
                const phases = store.phases().map((p) => (p.id === data.id ? data : p));
                patchState(store, { isLoading: false, phases });
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
          _phasesService.delete(id).pipe(
            tap({
              next: () => {
                const phases = store.phases().filter((p) => p.id !== id);
                patchState(store, { isLoading: false, phases, phase: null });
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
