import type { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'jobs',
        loadComponent: () => import('../pages/jobs/jobs.page').then((m) => m.JobsPage),
      },
      {
        path: 'jobs/:id',
        loadComponent: () => import('../pages/job-detail/job-detail.page').then((m) => m.JobDetailPage),
      },
      {
        path: 'candidaturas',
        loadComponent: () => import('../pages/candidaturas/candidaturas.page').then((m) => m.CandidaturasPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('../pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: 'jobs',
        pathMatch: 'full',
      },
    ],
  },
];
