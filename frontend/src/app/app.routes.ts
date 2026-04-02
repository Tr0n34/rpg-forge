import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./features/auth/callback/auth-callback.component').then((m) => m.AuthCallbackComponent)
  },
  {
    path: 'users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/users/users-page.component').then((m) => m.UsersPageComponent)
  },
  {
    path: 'characters',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'liste'
      },
      {
        path: 'liste',
        loadComponent: () =>
          import('./features/characters/characters-page.component').then((m) => m.CharactersPageComponent)
      },
      {
        path: 'creation',
        loadComponent: () =>
          import('./features/characters/character-form-page.component').then((m) => m.CharacterFormPageComponent)
      },
      {
        path: ':characterId/edition',
        loadComponent: () =>
          import('./features/characters/character-form-page.component').then((m) => m.CharacterFormPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
