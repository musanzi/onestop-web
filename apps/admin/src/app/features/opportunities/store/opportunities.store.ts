import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, finalize, pipe, switchMap, tap } from 'rxjs';
import { CreateOpportunityInterface } from '../interfaces/create-opportunity.interface';
import { FilterOpportunitiesInterface } from '../interfaces/filter-opportunities.interface';
import { OpportunitiesStoreInterface } from '../interfaces/opportunities-store.interface';
import { OpportunitiesService, UpdateOpportunityPayload } from '../services/opportunities.service';

export const OpportunitiesStore = signalStore(
  withState<OpportunitiesStoreInterface>({
    isLoading: false,
    opportunities: [],
    opportunity: null
  }),
  withProps(() => ({
    _opportunitiesService: inject(OpportunitiesService)
  })),
  withMethods(({ _opportunitiesService, ...store }) => ({
    loadAll: rxMethod<FilterOpportunitiesInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((filters) =>
          _opportunitiesService.getAll(filters).pipe(
            tap({
              next: (opportunities) => patchState(store, { isLoading: false, opportunities })
            }),
            catchError(() => {
              patchState(store, { opportunities: [] });
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
        switchMap((opportunityId) =>
          _opportunitiesService.getOne(opportunityId).pipe(
            tap({
              next: (opportunity) => patchState(store, { isLoading: false, opportunity })
            }),
            catchError(() => {
              patchState(store, { opportunity: null });
              return EMPTY;
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    create: rxMethod<CreateOpportunityInterface>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) =>
          _opportunitiesService.create(payload).pipe(
            tap({
              next: (opportunity) => patchState(store, { isLoading: false, opportunity })
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    update: rxMethod<UpdateOpportunityPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((payload) =>
          _opportunitiesService.update(payload).pipe(
            tap({
              next: (opportunity) => {
                const opportunities = store
                  .opportunities()
                  .map((item) => (item.id === opportunity.id ? opportunity : item));
                patchState(store, { isLoading: false, opportunity, opportunities });
              }
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    delete: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((opportunityId) =>
          _opportunitiesService.delete(opportunityId).pipe(
            tap({
              next: () => {
                const opportunities = store.opportunities().filter((item) => item.id !== opportunityId);
                const current = store.opportunity();
                patchState(store, {
                  isLoading: false,
                  opportunities,
                  opportunity: current?.id === opportunityId ? null : current
                });
              }
            }),
            catchError(() => EMPTY),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    )
  }))
);
