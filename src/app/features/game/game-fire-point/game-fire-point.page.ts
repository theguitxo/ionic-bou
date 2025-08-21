import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavController } from '@ionic/angular';
import { IonAvatar, ModalController } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { FIREWORKS_POINTS_POSITIONS, FIREWORKS_TYPES } from '../../../core/models/fireworks.points.model';
import { GameService } from '../../../core/services/game.service';
import { BackFirePointsComponent } from '../components/fire-points/back-fire-points/back-fire-points.component';
import { HeadFirePointsComponent } from '../components/fire-points/head-fire-points/head-fire-points.component';
import { FireworkInfoComponent } from '../components/firework-info/firework-info.component';

@Component({
  selector: 'app-game-fire-point',
  templateUrl: './game-fire-point.page.html',
  styleUrl: './game-fire-point.page.scss',
  imports: [
    TranslateModule,
    IonAvatar,
    HeadFirePointsComponent,
    BackFirePointsComponent,
  ],
})
export class GameFirePointPage implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);
  private readonly navController = inject(NavController);

  private showing = signal<FIREWORKS_POINTS_POSITIONS>(
    this.gameService.fireworkPlayedInfo?.fireworkPosition ?? 'HEAD'
  );

  protected showHeadValue = computed(() => this.showing() === 'HEAD');
  protected showBackValue = computed(() => this.showing() === 'BACK');
  protected firePoint = toSignal(this.gameService.currentGamePoint);

  protected disableCheckPoints = computed<boolean>(() => {
    return ![
      ...(this.firePoint()?.playFireworksPoints?.BANYES ?? [undefined]),
      ...(this.firePoint()?.playFireworksPoints?.MORRO ?? [undefined]),
      ...(this.firePoint()?.playFireworksPoints?.CUA ?? [undefined]),
    ]?.every((i) => !!i);
  });

  ngOnInit(): void {
    if (this.gameService.fireworkPlayedInfo) {
      this.gameService.fireworkPlayedInfo = undefined;
    }
  }

  protected showHead(): void {
    this.showing.set('HEAD');
  }

  protected showBack(): void {
    this.showing.set('BACK');
  }

  protected async showFireWork(firework: FIREWORKS_TYPES): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: FireworkInfoComponent,
      cssClass: 'app-modal',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        firework,
        labelFirstButton: 'BUTTONS.YES',
      },
    });

    modal.present();
  }

  protected acceptFirePoint(): void {
    this.gameService.checkPointScore();
    this.navController.navigateRoot([
      APP_ROUTES.GAME,
      APP_ROUTES.GAME_FIRE_VIDEO,
    ]);
  }
}
