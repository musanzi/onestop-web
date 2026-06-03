import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { buildQueryParams, extractApiErrorMessage } from '@shared/helpers';
import { IExpertise } from '@shared/models';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { ExpertiseInterface } from '../interfaces/expertise.interface';
import { FilterExpertisesInterface } from '../interfaces/filter-expertises.interface';

@Injectable({ providedIn: 'root' })
export class ExpertisesService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastrService);

  getAll(filters: FilterExpertisesInterface): Observable<[IExpertise[], number]> {
    const params = buildQueryParams(filters);

    return this.http.get<{ data: [IExpertise[], number] }>('expertises/paginated', { params }).pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  getAllUnpaginated(): Observable<IExpertise[]> {
    return this.http.get<{ data: IExpertise[] }>('expertises').pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  create(payload: ExpertiseInterface): Observable<IExpertise> {
    return this.http.post<{ data: IExpertise }>('expertises', payload).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Expertise ajoutée avec succès');
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Échec de l'ajout de l'expertise");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  update(id: string, payload: ExpertiseInterface): Observable<IExpertise> {
    return this.http.patch<{ data: IExpertise }>(`expertises/id/${id}`, payload).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Expertise mise à jour');
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, 'Échec de la mise à jour');
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`expertises/id/${id}`).pipe(
      map(() => {
        this.toast.showSuccess('Expertise supprimée avec succès');
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Échec de la suppression de l'expertise");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }
}
