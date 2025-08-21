import { FireworksPoints } from '../models/fireworks.points.model';

export const FIREWORKS_IMAGES_TYPES_PATH = '/assets/img/fireworks/types';
export const FIREWORKS_IMAGES_PLACES_PATH = '/assets/img/fireworks/places';

export enum FIREWORKS_COMBINATION {
  NORMAL = 'normal',
  PONT_FRANSA = 'pont_fransa',
  PL_NOVA = 'pl_nova',
  RAMBLA = 'rambla',
  PL_VELLA = 'pl_vella',
}

export const BANYES_TOTAL_POINTS = 2;
export const CUA_TOTAL_POINTS = 3;
export const MORRO_TOTAL_POINTS = 7;

export enum FIREWORKS_POINTS {
  BANYES_1,
  BANYES_2,
  MORRO_1,
  MORRO_2,
  MORRO_3,
  MORRO_4,
  MORRO_5,
  MORRO_6,
  MORRO_7,
  CUA_1,
  CUA_2,
  CUA_3,
}

export const NORMAL_COMBINATIONS: FireworksPoints[] = [
  {
    CUA: ['CARRETILLA', 'SUPER_CARRETILLA', 'CARRETILLA'],
    BANYES: ['SORTIDOR', 'SORTIDOR'],
    MORRO: [
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
    ],
  },
  {
    CUA: ['CARRETILLA', 'CARRETILLA', 'CARRETILLA'],
    BANYES: ['RONCADOR', 'RONCADOR'],
    MORRO: [
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
    ],
  },
  {
    CUA: ['CARRETILLA', 'RONCADOR', 'CARRETILLA'],
    BANYES: ['SUPER_CARRETILLA', 'SUPER_CARRETILLA'],
    MORRO: [
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
      'CARRETILLA',
    ],
  },
];

export const SPECIAL_COMBINATIONS: FireworksPoints[] = [
  {
    CUA: ['RONCADOR', 'RONCADOR', 'RONCADOR'],
    BANYES: ['VOLCANET', 'VOLCANET'],
    MORRO: [
      'CRACKER',
      'CRACKER',
      'CRACKER',
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
    ],
  },
  {
    CUA: ['SUPER_CARRETILLA', 'VOLCANET', 'SUPER_CARRETILLA'],
    BANYES: ['CRACKER', 'CRACKER'],
    MORRO: [
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
      'SORTIDOR',
      'SORTIDOR',
      'SORTIDOR',
      'SORTIDOR',
    ],
  },
  {
    CUA: ['RONCADOR', 'CRACKER', 'RONCADOR'],
    BANYES: ['SUPER_CARRETILLA', 'SUPER_CARRETILLA'],
    MORRO: [
      'SUPER_CARRETILLA',
      'CRACKER',
      'SUPER_CARRETILLA',
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
    ],
  },
  {
    CUA: ['SUPER_CARRETILLA', 'VOLCANET', 'SUPER_CARRETILLA'],
    BANYES: ['CRACKER', 'CRACKER'],
    MORRO: [
      'RONCADOR',
      'RONCADOR',
      'RONCADOR',
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
      'SUPER_CARRETILLA',
    ],
  },
];
