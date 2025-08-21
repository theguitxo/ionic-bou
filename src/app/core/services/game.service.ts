import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { GeneralUtils } from '../../utils/general.utils';
import { TRANSLATE_KEYS } from '../constants/fire.points.constants';
import {
    BANYES_TOTAL_POINTS,
    CUA_TOTAL_POINTS,
    FIREWORKS_COMBINATION,
    FIREWORKS_POINTS,
    MORRO_TOTAL_POINTS,
    NORMAL_COMBINATIONS,
    SPECIAL_COMBINATIONS,
} from '../constants/fireworks.contants';
import { GAME_MODE } from '../constants/game.constants';
import { GAME_DIFFICULTY } from '../constants/settings.constants';
import { FirePoints, GameFirePoints } from '../models/fire.points.model';
import { FireworkPlayedInfo, FIREWORKS_TYPES, FireworksPoints } from '../models/fireworks.points.model';
import { GameScoresSummary } from '../models/game.summary.model';
import { SettingsService } from './settings.service';

@Injectable()
export class GameService {
  private readonly settingsService = inject(SettingsService);

  private _gameMode = signal<GAME_MODE | undefined>(undefined);
  set gameMode(value: GAME_MODE | undefined) {
    this._gameMode.set(value);
  }
  get gameMode(): WritableSignal<GAME_MODE | undefined> {
    return this._gameMode;
  }

  private _showExitButton = signal<boolean>(true);
  set showExitButton(value: boolean) {
    this._showExitButton.set(value);
  }
  get showExitButton(): WritableSignal<boolean> {
    return this._showExitButton;
  }

  private _gpsCheckProgress = new BehaviorSubject<number>(0);
  public gpsCheckProgress = this._gpsCheckProgress.asObservable();

  public updateGpsCheckProgress(value: number): void {
    this._gpsCheckProgress.next(value);
  }

  private _gameFirePoints = new BehaviorSubject<GameFirePoints[] | undefined>(
    undefined
  );
  public gameFirePoints = this._gameFirePoints.asObservable();

  private _normalCombination!: FireworksPoints;
  private _specialCombination1!: FireworksPoints;
  private _specialCombination2!: FireworksPoints;

  private _checkingFirePoint = new BehaviorSubject<boolean>(false);
  public chekingFirePoint = this._checkingFirePoint.asObservable();

  private _currentGamePoint = new BehaviorSubject<GameFirePoints | undefined>(
    undefined
  );
  public currentGamePoint = this._currentGamePoint.asObservable();

  private _enabledGamePoint = new BehaviorSubject<GameFirePoints | undefined>(
    undefined
  );
  public enabledGamePoint = this._enabledGamePoint.asObservable();

  private _allPlayed = new BehaviorSubject<boolean>(false);
  public allPlayed = this._allPlayed.asObservable();

  private _summaryScores = new BehaviorSubject<GameScoresSummary[]>([]);
  public summaryScores = this._summaryScores.asObservable();

  private _fireworkPlayedInfo?: FireworkPlayedInfo;

  /**
   * Emite la información actualizada de los puntos de fuego y el seleccionado
   * @param gameFirePoints Información de los puntos de fuego
   */
  private emitGameFirePointsInfo(
    gameFirePoints: GameFirePoints[] | undefined
  ): void {
    this._gameFirePoints.next(gameFirePoints);
    this._currentGamePoint.next(
      this._gameFirePoints.value?.find((item) => item.isCurrent)
    );
    this._enabledGamePoint.next(
      this._gameFirePoints.value?.find((item) => item.enabled)
    );
    this._allPlayed.next(
      this._gameFirePoints.value?.length
        ? this._gameFirePoints.value.every((i) => i.played)
        : false
    );
    this._summaryScores.next(
      this._gameFirePoints.value?.length
        ? this._gameFirePoints.value.map((item) => ({
            firePointTranslateKey: item.translateKey as TRANSLATE_KEYS,
            score: item.scores?.TOTAL.score,
          }))
        : []
    );
  }

  /**
   * Establece el punto de fuego sobre el que se esta jugando
   * @param value punto de fuego
   */
  public setCurrentGamePoint(value: GameFirePoints) {
    const gameFirePoints = this._gameFirePoints.value?.map(
      (item: GameFirePoints) => ({
        ...item,
        isCurrent: item.id === value.id,
      })
    );

    this.emitGameFirePointsInfo(gameFirePoints);
  }

  /**
   * Genera la información del juego para una partida
   */
  public generateGame(): void {
    this._normalCombination =
      NORMAL_COMBINATIONS[
        Math.trunc(Math.random() * NORMAL_COMBINATIONS.length)
      ];
    this._specialCombination1 =
      SPECIAL_COMBINATIONS[
        Math.trunc(Math.random() * SPECIAL_COMBINATIONS.length)
      ];
    this._specialCombination2 =
      SPECIAL_COMBINATIONS[
        Math.trunc(Math.random() * SPECIAL_COMBINATIONS.length)
      ];

    const gameFirePoints: GameFirePoints[] = this.settingsService.firePoints
      ?.map((point: FirePoints, index: number) => {
        const gameFirePoint: GameFirePoints = {
          ...point,
          id: uuidv4(),
          isCurrent: false,
          first: !index,
          played: false,
          enabled: !index,
          headerImage: `assets/img/fire_points/headers/${point.code}.png`,
          avatarImage: `assets/img/fire_points/avatars/${point.code}.png`,
          backgroundImage: `assets/img/fire_points/backgrounds/${point.code}.png`,
          translateKey:
            TRANSLATE_KEYS[point.code as keyof typeof TRANSLATE_KEYS],
          fireworksPoints: this.generateFireWorkPoints(point.type),
          playFireworksPoints: {
            CUA: new Array(CUA_TOTAL_POINTS).fill(undefined),
            BANYES: new Array(BANYES_TOTAL_POINTS).fill(undefined),
            MORRO: new Array(MORRO_TOTAL_POINTS).fill(undefined),
          },
          scores: {
            BANYES: {
              score: 0,
              percentage: 0,
            },
            MORRO: {
              score: 0,
              percentage: 0,
            },
            CUA: {
              score: 0,
              percentage: 0,
            },
            TOTAL: {
              score: 0,
              percentage: 0,
            },
          },
          firePointTypeColor:
            point.type === FIREWORKS_COMBINATION.NORMAL ? 'primary' : 'success',
          firePointTypeText:
            point.type === FIREWORKS_COMBINATION.NORMAL
              ? 'FIRE_POINT_CARD.NORMAL'
              : 'FIRE_POINT_CARD.SPECIAL',
        };

        return gameFirePoint;
      })
      ?.sort((a: GameFirePoints, b: GameFirePoints) => a.order - b.order);

    this.emitGameFirePointsInfo(gameFirePoints);
  }

  /**
   * Resetea la información de la partida
   */
  public finishGame(): void {
    this._gameFirePoints.next(undefined);
  }

  /**
   * Establece la información de los cohetes de la partida
   * @param type Tipo de combinación
   * @returns Una combinación de cohetes
   */
  private generateFireWorkPoints(type: FIREWORKS_COMBINATION): FireworksPoints {
    if (this.settingsService.gameDifficulty === GAME_DIFFICULTY.EASY) {
      switch (type) {
        case FIREWORKS_COMBINATION.PONT_FRANSA:
        case FIREWORKS_COMBINATION.RAMBLA:
          return this._specialCombination1;
        case FIREWORKS_COMBINATION.PL_NOVA:
        case FIREWORKS_COMBINATION.PL_VELLA:
          return this._specialCombination2;
        default:
          return this._normalCombination;
      }
    } else if (this.settingsService.gameDifficulty === GAME_DIFFICULTY.MEDIUM) {
      const allCombinations = [...NORMAL_COMBINATIONS, ...SPECIAL_COMBINATIONS];
      return allCombinations[
        Math.trunc(Math.random() * allCombinations.length)
      ];
    } else {
      return {
        BANYES: this.getFireCombination(2),
        CUA: this.getFireCombination(3),
        MORRO: this.getFireCombination(7),
      };
    }
  }

  private getFireCombination(size: number): FIREWORKS_TYPES[] {
    const allFireworks = [
      'CARRETILLA',
      'SORTIDOR',
      'RONCADOR',
      'SUPER_CARRETILLA',
      'CRACKER',
      'VOLCANET',
    ];
    const array = Array(size).fill(null);

    array.forEach((value, idx) => {
      const firework =
        allFireworks[Math.trunc(Math.random() * allFireworks.length)];
      array[idx] = firework;
    });

    return array;
  }

  /**
   * Actualiza la situación de comprobar si el jugador esta cerca de la posición real
   * @param value boolean
   */
  public updateCheckingFirePoint(value: boolean): void {
    this._checkingFirePoint.next(value);
  }

  /**
   * Actualiza la información relacionada con los cohetes colocados durante el juego
   * @param firePoint Punto donde se coloca el cohete
   * @param firework Tipo de cohete que se coloca
   */
  public setGamePlayFirework(
    firePoint: FIREWORKS_POINTS,
    firework: FIREWORKS_TYPES
  ): void {
    const gameFirePointsUpdated = this._gameFirePoints.value?.map(
      (item: GameFirePoints) => ({
        ...item,
        playFireworksPoints:
          item.isCurrent && item.playFireworksPoints
            ? this.setGamePlayFireworkInfo(
                firePoint,
                firework,
                item.playFireworksPoints
              )
            : item.playFireworksPoints,
      })
    );

    this.emitGameFirePointsInfo(gameFirePointsUpdated);
  }

  /**
   * Setea la información de un punto de inserción de cohete durante el juego
   * @param firePoint Punto de colocación
   * @param firework Tipo de cohete
   * @param items Posiciones de cohetes
   * @returns Posiciones de cohetes
   */
  private setGamePlayFireworkInfo(
    firePoint: FIREWORKS_POINTS,
    firework: FIREWORKS_TYPES,
    items: FireworksPoints
  ): FireworksPoints {
    switch (firePoint) {
      case FIREWORKS_POINTS.BANYES_1:
        items.BANYES[0] = firework;
        break;
      case FIREWORKS_POINTS.BANYES_2:
        items.BANYES[1] = firework;
        break;
      case FIREWORKS_POINTS.CUA_1:
        items.CUA[0] = firework;
        break;
      case FIREWORKS_POINTS.CUA_2:
        items.CUA[1] = firework;
        break;
      case FIREWORKS_POINTS.CUA_3:
        items.CUA[2] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_1:
        items.MORRO[0] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_2:
        items.MORRO[1] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_3:
        items.MORRO[2] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_4:
        items.MORRO[3] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_5:
        items.MORRO[4] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_6:
        items.MORRO[5] = firework;
        break;
      case FIREWORKS_POINTS.MORRO_7:
        items.MORRO[6] = firework;
        break;
    }

    return items;
  }

  /**
   * Métodos para elegir un cohete y un lugar de colocación durante el juego
   */
  set fireworkPlayedInfo(value: FireworkPlayedInfo | undefined) {
    if (value) {
      this._fireworkPlayedInfo = {
        firePosition:
          value?.firePosition ?? this._fireworkPlayedInfo?.firePosition,
        firework: value?.firework ?? this._fireworkPlayedInfo?.firework,
        fireworkPosition: value.fireworkPosition,
      };
    } else {
      this._fireworkPlayedInfo = undefined;
    }
  }

  get fireworkPlayedInfo(): FireworkPlayedInfo | undefined {
    return this._fireworkPlayedInfo;
  }

  /**
   * Establece la información de la puntuación del punto en el que se está jugando
   */
  public checkPointScore(): void {
    const banyesScore = GeneralUtils.getTotalEqualArrayValues(
      this._currentGamePoint.value?.playFireworksPoints?.BANYES ?? [],
      this._currentGamePoint.value?.fireworksPoints?.BANYES ?? []
    );

    const morroScore = GeneralUtils.getTotalEqualArrayValues(
      this._currentGamePoint.value?.playFireworksPoints?.MORRO ?? [],
      this._currentGamePoint.value?.fireworksPoints?.MORRO ?? []
    );

    const cuaScore = GeneralUtils.getTotalEqualArrayValues(
      this._currentGamePoint.value?.playFireworksPoints?.CUA ?? [],
      this._currentGamePoint.value?.fireworksPoints?.CUA ?? []
    );

    if (this._currentGamePoint.value) {
      this._currentGamePoint.value.scores = {
        BANYES: {
          score: banyesScore,
          percentage: (banyesScore * 100) / BANYES_TOTAL_POINTS,
        },
        MORRO: {
          score: morroScore,
          percentage: (morroScore * 100) / MORRO_TOTAL_POINTS,
        },
        CUA: {
          score: cuaScore,
          percentage: (cuaScore * 100) / CUA_TOTAL_POINTS,
        },
        TOTAL: {
          score: banyesScore + morroScore + cuaScore,
          percentage:
            ((banyesScore + morroScore + cuaScore) * 100) /
            (BANYES_TOTAL_POINTS + MORRO_TOTAL_POINTS + CUA_TOTAL_POINTS),
        },
      };
    }
  }

  /**
   * Modifica el punto de fuego actual para indicar que se ha jugado
   */
  public playCurrentFirePoint(): void {
    const gameFirePointsUpdated =
      this._gameFirePoints.value?.map((item: GameFirePoints) => ({
        ...item,
        isCurrent: false,
        enabled: false,
        played:
          item.code === this._currentGamePoint.value?.code ? true : item.played,
      })) ?? [];

    const currentIndex = gameFirePointsUpdated?.findIndex(
      (item) => item.code === this._currentGamePoint.value?.code
    );
    if (
      currentIndex > -1 &&
      GeneralUtils.IndexInArray(gameFirePointsUpdated, currentIndex + 1)
    ) {
      gameFirePointsUpdated[currentIndex + 1].enabled = true;
    }

    this.emitGameFirePointsInfo(gameFirePointsUpdated);
  }
}
