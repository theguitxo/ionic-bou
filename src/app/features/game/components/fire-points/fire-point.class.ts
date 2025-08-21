import {
    DestroyRef,
    Directive,
    inject,
    Input,
    output,
    Signal,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { FIREWORKS_POINTS } from '../../../../core/constants/fireworks.contants';
import { APP_ROUTES } from '../../../../core/constants/routes.constants';
import { FIREWORKS_MODE, FIREWORKS_POINTS_POSITIONS, FIREWORKS_TYPES, FireworksPoints } from '../../../../core/models/fireworks.points.model';
import { GameService } from '../../../../core/services/game.service';

@Directive()
export abstract class FirePointDirective {
  @Input() points!: FireworksPoints | undefined;
  @Input() mode!: FIREWORKS_MODE | undefined;

  public showFirework = output<FIREWORKS_TYPES>();

  protected fireworksPointsPosition!: FIREWORKS_POINTS_POSITIONS;

  protected gameService = inject(GameService);
  protected destroyRef = inject(DestroyRef);
  private readonly navController = inject(NavController);

  protected _fireworkTypes: FIREWORKS_TYPES[] = [
    'CARRETILLA',
    'CRACKER',
    'RONCADOR',
    'SUPER_CARRETILLA',
    'SORTIDOR',
    'VOLCANET',
  ];

  protected fireworkPoints = FIREWORKS_POINTS;

  protected fireworkPointsValues!: Signal<
    Map<FIREWORKS_POINTS, FIREWORKS_TYPES | undefined> | undefined
  >;

  protected setFirePointValues(value: FIREWORKS_TYPES | undefined): {
    [key: string]: boolean;
  } {
    const values: { [key: string]: boolean } = {};
    this._fireworkTypes.forEach((k) => (values[k] = k === value));
    return values;
  }

  protected fireWorkClicked(
    event: MouseEvent | TouchEvent,
    firePosition: FIREWORKS_POINTS
  ): void {
    event.stopPropagation();
    if (this.mode === 'PLAY') {
      this.gameService.fireworkPlayedInfo = {
        firePosition,
        fireworkPosition: this.fireworksPointsPosition,
      };

      this.navController.navigateRoot([
        APP_ROUTES.GAME,
        APP_ROUTES.FIREWORK_SELECTOR,
      ]);
    } else {
      const value = this.fireworkPointsValues()?.get(firePosition);
      if (value) {
        this.showFirework.emit(value);
      }
    }
  }
}
