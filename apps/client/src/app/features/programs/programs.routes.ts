import { Routes } from '@angular/router';
import { SEO_PUBLIC } from '@core/services/seo';

export const programsRoutes: Routes = [
  {
    path: '',
    title: 'Programmes',
    data: { seo: SEO_PUBLIC.ourPrograms },
    loadComponent: () => import('./pages/list-programs/list-programs').then((c) => c.ListPrograms)
  },
  {
    path: ':slug',
    title: 'Programme',
    data: { seo: SEO_PUBLIC.ourPrograms },
    loadComponent: () => import('./pages/detail-programs/detail-programs').then((c) => c.DetailPrograms)
  },
  {
    path: ':programSlug/:subprogramSlug',
    title: 'Sous-programme',
    data: { seo: SEO_PUBLIC.ourPrograms },
    loadComponent: () => import('./pages/list-sub-programs/list-sub-programs').then((c) => c.ListSubPrograms)
  }
];
