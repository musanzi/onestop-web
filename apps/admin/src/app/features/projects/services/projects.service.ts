import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { buildQueryParams, extractApiErrorMessage } from '@shared/helpers';
import { IProject } from '@shared/models';
import { ToastrService } from '@shared/services/toast/toastr.service';
import { FilterProjectsInterface } from '../interfaces/filter-projects.interface';
import { ProjectInterface } from '../interfaces/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastrService);

  getAll(filters: FilterProjectsInterface): Observable<[IProject[], number]> {
    const params = buildQueryParams(filters);

    return this.http.get<{ data: [IProject[], number] }>('projects', { params }).pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  getOne(slug: string): Observable<IProject> {
    return this.http.get<{ data: IProject }>(`projects/by-slug/${slug}`).pipe(
      map(({ data }) => data),
      catchError(() => of())
    );
  }

  create(project: ProjectInterface): Observable<IProject> {
    return this.http.post<{ data: IProject }>('projects', project).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Le projet a été ajouté avec succès');
        this.router.navigate(['/projects']);
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Une erreur s'est produite lors de l'ajout du projet");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  update(project: ProjectInterface): Observable<IProject> {
    return this.http.patch<{ data: IProject }>(`projects/id/${project.id}`, project).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Le projet a été mis à jour avec succès');
        this.router.navigate(['/projects']);
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Une erreur s'est produite lors de la mise à jour");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  publish(id: string): Observable<IProject> {
    return this.http.patch<{ data: IProject }>(`projects/id/${id}/publish`, {}).pipe(
      map(({ data }) => data),
      catchError((error) => {
        const message = extractApiErrorMessage(error, 'Erreur lors du changement de publication');
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  showcase(id: string): Observable<IProject> {
    return this.http.patch<{ data: IProject }>(`projects/id/${id}/highlight`, {}).pipe(
      map(({ data }) => {
        this.toast.showSuccess('Projet mis en avant avec succès');
        return data;
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, 'Erreur lors de la mise en avant du projet');
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<{ data: IProject }>(`projects/id/${id}`).pipe(
      map(() => {
        this.toast.showSuccess('Le projet a été supprimé avec succès');
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Une erreur s'est produite lors de la suppression");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }

  importParticipantsCsv(projectId: string, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<unknown>(`projects/id/${projectId}/participants/import-csv`, formData).pipe(
      map(() => {
        this.toast.showSuccess('Les participants ont été importés avec succès');
      }),
      catchError((error) => {
        const message = extractApiErrorMessage(error, "Une erreur s'est produite lors de l'import des participants");
        this.toast.showError(message);
        return throwError(() => message);
      })
    );
  }
}
