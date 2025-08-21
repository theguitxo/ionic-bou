import { FIREWORKS_POINTS } from '../constants/fireworks.contants';

export type FIREWORKS_TYPES =
  | 'CARRETILLA'
  | 'SORTIDOR'
  | 'RONCADOR'
  | 'SUPER_CARRETILLA'
  | 'CRACKER'
  | 'VOLCANET';

export type FIREWORKS_POINTS_POSITIONS = 'HEAD' | 'BACK';
export type FIREWORKS_MODE = 'SHOW' | 'PLAY';

export interface FireworksPoints {
  BANYES: Array<FIREWORKS_TYPES | undefined>;
  MORRO: Array<FIREWORKS_TYPES | undefined>;
  CUA: Array<FIREWORKS_TYPES | undefined>;
}

export interface FireworksPointsScoresValues {
  score: number;
  percentage: number;
}
export interface FireworksPointsScores {
  BANYES: FireworksPointsScoresValues;
  MORRO: FireworksPointsScoresValues;
  CUA: FireworksPointsScoresValues;
  TOTAL: FireworksPointsScoresValues;
}

export interface FireworkPlayedInfo {
  firePosition: FIREWORKS_POINTS;
  firework?: FIREWORKS_TYPES;
  fireworkPosition: FIREWORKS_POINTS_POSITIONS;
}
