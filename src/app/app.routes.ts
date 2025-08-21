import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/routes.constants';

export const routes: Routes = [
  {
    path: APP_ROUTES.HOME,
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
  },
  {
    path: APP_ROUTES.GAME,
    loadComponent: () =>
      import('./features/game/game.page').then((m) => m.GamePage),
    children: [
      {
        path: APP_ROUTES.FIRE_POINTS_LIST,
        loadComponent: () =>
          import(
            './features/game/fire-points-list/fire-points-list.page'
          ).then((m) => m.FirePointsListPage),
      },
      {
        path: APP_ROUTES.GAME_FIRE_POINT,
        loadComponent: () =>
          import(
            './features/game/game-fire-point/game-fire-point.page'
          ).then((m) => m.GameFirePointPage),
      },
      {
        path: APP_ROUTES.FIREWORK_SELECTOR,
        loadComponent: () =>
          import(
            './features/game/firework-selector/firework-selector.page'
          ).then((m) => m.FireworkSelectorPage),
      },
      {
        path: APP_ROUTES.GAME_FIRE_VIDEO,
        loadComponent: () =>
          import(
            './features/game/game-fire-video/game-fire-video.component'
          ).then((m) => m.GameFireVideoComponent),
      },
      {
        path: APP_ROUTES.GAME_SUMMARY,
        loadComponent: () =>
          import('./features/game/game-summary/game-summary.component').then(
            (m) => m.GameSummaryComponent
          ),
      },
      {
        path: APP_ROUTES.FIRE_COMBINATIONS,
        loadComponent: () =>
          import(
            './features/game/fire-combinations/fire-combinations.page'
          ).then((m) => m.FireCombinationsPage),
      },
      {
        path: '',
        redirectTo: APP_ROUTES.FIRE_COMBINATIONS,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: APP_ROUTES.INSTRUCTIONS,
    loadComponent: () =>
      import('./features/instructions/instructions.page').then(
        (m) => m.InstructionsPage
      ),
  },
  {
    path: APP_ROUTES.CONFIGURATION,
    loadComponent: () =>
      import('./features/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
