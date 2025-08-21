import { GAME_DIFFICULTY, LANGUAGES } from "../constants/settings.constants";

export interface RadioOption<T> {
  value: T;
  label: string;
}

export interface Settings {
  language?: LANGUAGES;
  gameDifficulty?: GAME_DIFFICULTY;
}

export interface AppValues {
  instructionsReaded?: boolean;
  noShowInstructionsReaded?: boolean;
  noShowFirePointsWarning?: boolean;
}
