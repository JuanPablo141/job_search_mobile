import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'init',
    loadComponent: () => import('./pages/init/init.page').then((m) => m.InitPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: '/init',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/init',
  },
];
