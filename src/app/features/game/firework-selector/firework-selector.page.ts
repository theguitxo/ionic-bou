import { Component, inject, signal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FIREWORKS_POINTS } from '../../../core/constants/fireworks.contants';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { FIREWORKS_TYPES } from '../../../core/models/fireworks.points.model';
import { GameService } from '../../../core/services/game.service';
import { FireworkSelectButton } from './firework-selector.models';

@Component({
  selector: 'app-firework-selector',
  templateUrl: './firework-selector.page.html',
  styleUrl: './firework-selector.page.scss',
  imports: [TranslateModule],
})
export class FireworkSelectorPage {
  private readonly gameService = inject(GameService);
  private readonly navController = inject(NavController);

  protected selectFireworkButtons = signal<FireworkSelectButton[]>([
    {
      img: 'assets/img/fireworks/types/carretilla.svg',
      label: 'FIREWORKS.CARRETILLA.NAME',
      type: 'CARRETILLA',
    },
    {
      img: 'assets/img/fireworks/types/supercarretilla.svg',
      label: 'FIREWORKS.SUPER_CARRETILLA.NAME',
      type: 'SUPER_CARRETILLA',
    },
    {
      img: 'assets/img/fireworks/types/sortidor.svg',
      label: 'FIREWORKS.SORTIDOR.NAME',
      type: 'SORTIDOR',
    },
    {
      img: 'assets/img/fireworks/types/roncador.svg',
      label: 'FIREWORKS.RONCADOR.NAME',
      type: 'RONCADOR',
    },
    {
      img: 'assets/img/fireworks/types/cracker.svg',
      label: 'FIREWORKS.CRACKER.NAME',
      type: 'CRACKER',
    },
    {
      img: 'assets/img/fireworks/types/volcanet.svg',
      label: 'FIREWORKS.VOLCANET.NAME',
      type: 'VOLCANET',
    },
  ]);

  protected fireworkPosition = signal(
    new Map<FIREWORKS_POINTS, string>([
      [FIREWORKS_POINTS.BANYES_1, 'assets/img/fireworks/places/banyes_1.png'],
      [FIREWORKS_POINTS.BANYES_2, 'assets/img/fireworks/places/banyes_2.png'],
      [FIREWORKS_POINTS.CUA_1, 'assets/img/fireworks/places/cua_1.png'],
      [FIREWORKS_POINTS.CUA_2, 'assets/img/fireworks/places/cua_2.png'],
      [FIREWORKS_POINTS.CUA_3, 'assets/img/fireworks/places/cua_3.png'],
      [FIREWORKS_POINTS.MORRO_1, 'assets/img/fireworks/places/morro_1.png'],
      [FIREWORKS_POINTS.MORRO_2, 'assets/img/fireworks/places/morro_2.png'],
      [FIREWORKS_POINTS.MORRO_3, 'assets/img/fireworks/places/morro_3.png'],
      [FIREWORKS_POINTS.MORRO_4, 'assets/img/fireworks/places/morro_4.png'],
      [FIREWORKS_POINTS.MORRO_5, 'assets/img/fireworks/places/morro_5.png'],
      [FIREWORKS_POINTS.MORRO_6, 'assets/img/fireworks/places/morro_6.png'],
      [FIREWORKS_POINTS.MORRO_7, 'assets/img/fireworks/places/morro_7.png'],
    ])
  );
  protected firePoint = this.gameService.fireworkPlayedInfo?.firePosition;

  protected returnGameFirePoint(): void {
    this.navController.navigateRoot([
      APP_ROUTES.GAME,
      APP_ROUTES.GAME_FIRE_POINT,
    ]);
  }

  protected selectFirework(selected: FIREWORKS_TYPES): void {
    if (this.firePoint !== undefined) {
      this.gameService.setGamePlayFirework(this.firePoint, selected);
    }
    this.returnGameFirePoint();
  }
}
