import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { FilterParticipationsInterface } from '../interfaces/filter-participations.interface';
import { MoveParticipationsInterface } from '../interfaces/move-participations.interface';
import { ReviewParticipationInterface } from '../interfaces/review-participation.interface';
import { ParticipationsStoreInterface } from '../interfaces/participations-store.interface';
import { ParticipationsService } from '../services/participations.service';

export const ParticipationsStore = signalStore(
  withState<ParticipationsStoreInterface>({
    isLoading: false,
    isDetailLoading: false,
    isSaving: false,
    participations: [],
    total: 0,
    participation: null,
    error: null
  }),
  withComputed(({ participations, error }) => ({
    hasParticipations: computed(() => participations().length > 0),
    isEmpty: computed(() => participations().length === 0 && !error()),
    hasError: computed(() => !!error())
  })),
  withProps(() => ({
    _participationsService: inject(ParticipationsService)
  })),
  withMethods(({ _participationsService, ...store }) => ({
    loadAll: rxMethod<{ projectId: string; filters: FilterParticipationsInterface }>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(({ projectId, filters }) =>
          _participationsService.getAll(projectId, filters).pipe(
            tap({
              next: ({ participations, total }) => {
                patchState(store, {
                  isLoading: false,
                  participations,
                  total,
                  error: null
                });
              }
            }),
            catchError((error) => {
              patchState(store, {
                participations: [],
                total: 0,
                error: String(error)
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),

    loadOne: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isDetailLoading: true, error: null })),
        switchMap((participationId) =>
          _participationsService.getOne(participationId).pipe(
            tap({
              next: (participation) => {
                patchState(store, {
                  isDetailLoading: false,
                  participation,
                  error: null
                });
              }
            }),
            catchError((error) => {
              patchState(store, {
                participation: null,
                error: String(error)
              });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isDetailLoading: false }))
          )
        )
      )
    ),

    moveToPhase: rxMethod<MoveParticipationsInterface>(
      pipe(
        tap(() => patchState(store, { isSaving: true, error: null })),
        switchMap((dto) =>
          _participationsService.moveToPhase(dto).pipe(
            tap({
              next: () => {
                patchState(store, { isSaving: false, error: null });
              }
            }),
            catchError((error) => {
              patchState(store, { error: String(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          )
        )
      )
    ),

    removeFromPhase: rxMethod<MoveParticipationsInterface>(
      pipe(
        tap(() => patchState(store, { isSaving: true, error: null })),
        switchMap((dto) =>
          _participationsService.removeFromPhase(dto).pipe(
            tap({
              next: () => {
                patchState(store, { isSaving: false, error: null });
              }
            }),
            catchError((error) => {
              patchState(store, { error: String(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          )
        )
      )
    ),

    review: rxMethod<{ participationId: string; dto: ReviewParticipationInterface }>(
      pipe(
        tap(() => patchState(store, { isSaving: true, error: null })),
        switchMap(({ participationId, dto }) =>
          _participationsService.review(participationId, dto).pipe(
            tap({
              next: () => {
                patchState(store, { isSaving: false, error: null });
              }
            }),
            catchError((error) => {
              patchState(store, { error: String(error) });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isSaving: false }))
          )
        )
      )
    ),

    clearParticipation(): void {
      patchState(store, {
        participation: null,
        error: null,
        isDetailLoading: false
      });
    },

    resetState(): void {
      patchState(store, {
        isLoading: false,
        isDetailLoading: false,
        isSaving: false,
        participations: [],
        total: 0,
        participation: null,
        error: null
      });
    }
  }))
);
