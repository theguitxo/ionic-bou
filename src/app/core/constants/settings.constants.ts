export const Settings_LOCALSTORAGE_KEY = 'settings';
export const AppValues_LOCALSTORAGE_KEY = 'appvalues';

export enum SETTINGS_OPTIONS {
  LANGUAGE = 'LANGUAGE',
  // POINTS_PRECISION = 'POINTS_PRECISION',
  GAME_DIFFICULTY = 'GAME_DIFFICULTY',
}

// export enum POINTS_PRECISION {
//   STANDART = 10,
//   NEAR = 5,
//   EXACT = 2,
// }

// export const DEFAULT_POINTS_PRECISION = POINTS_PRECISION.STANDART;

export enum LANGUAGES {
  SPANISH = 'es',
  CATALAN = 'ca',
}

export const DEFAULT_LANGUAGE = LANGUAGES.CATALAN;

export enum GAME_DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
}

export const DEFAULT_GAME_DIFFICULTY = GAME_DIFFICULTY.EASY;
