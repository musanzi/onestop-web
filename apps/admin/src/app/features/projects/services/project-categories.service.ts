import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { buildQueryParams, extractApiErrorMessage } from '@shared/helpers';
import { ICategory } from '@shared/models';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { FilterProjectCategoriesInterface } from '../interfaces/filter-project-categories.interface';
import { ProjectCategoryInterface } from '../interfaces/project-category.interface';

@Injectable({ providedIn: 'root' })
export class ProjectCategoriesService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastrService);

  getAll(filters: FilterProjectCategoriesInterface): Observable<[ICategory[], number]> {
    const params = buildQueryParams(filters);

    return this.http.get<{ data: [ICategory[], number] }>('project-categories/paginated', { params }).pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  getAllUnpaginated(): Observable<ICategory[]> {
    return this.http.get<{ data: ICategory[] }>('project-categories').pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  create(payload: ProjectCategoryInterface): Observable<ICategory> {
    return this.http.post<{ data: ICategory }>('project-categories', payload).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Catégorie ajoutée avec succès');
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Échec de l'ajout de la catégorie");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  update(id: string, payload: { name: string }): Observable<ICategory> {
    return this.http.patch<{ data: ICategory }>(`project-categories/id/${id}`, payload).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Catégorie mise à jour');
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
    return this.http.delete<void>(`project-categories/id/${id}`).pipe(
      map(() => {
        this.toast.showSuccess('Catégorie supprimée avec succès');
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, 'Échec de la suppression de la catégorie');
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }
}
