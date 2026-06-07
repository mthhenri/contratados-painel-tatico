import { Routes } from '@angular/router';

export const SESSIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/session-list/session-list.component').then(
        (m) => m.SessionListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/session-detail/session-detail.component').then(
        (m) => m.SessionDetailComponent,
      ),
  },
];
