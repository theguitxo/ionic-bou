import { WritableSignal } from '@angular/core';
import { Position } from '@capacitor/geolocation';
import { FIREWORKS_COMBINATION } from '../constants/fireworks.contants';
import {
  FireworksPoints,
  FireworksPointsScores,
} from './fireworks.points.model';

export interface FirePointsPoint {
  latitude: number;
  longitude: number;
}
export interface FirePoints {
  code: string;
  points: FirePointsPoint[];
  order: number;
  type: FIREWORKS_COMBINATION;
  check_distance: number;
  results?: WritableSignal<Position[]>;
}

export interface GameFirePoints extends FirePoints {
  id: string;
  isCurrent: boolean;
  first: boolean;
  translateKey?: string;
  completed?: boolean;
  headerImage?: string;
  avatarImage?: string;
  backgroundImage?: string;
  fireworksPoints?: FireworksPoints;
  playFireworksPoints?: FireworksPoints;
  scores?: FireworksPointsScores;
  firePointTypeColor?: string;
  firePointTypeText?: string;
  played?: boolean;
  enabled?: boolean;
}
