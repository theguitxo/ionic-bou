import { NgStyle } from '@angular/common';
import {
    Component,
    computed,
    ElementRef,
    inject,
    ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-fire-video',
  templateUrl: './game-fire-video.component.html',
  styleUrl: './game-fire-video.component.scss',
  imports: [TranslateModule, NgStyle],
})
export class GameFireVideoComponent {
  @ViewChild('video') video!: ElementRef;

  private readonly gameService = inject(GameService);
  private readonly navController = inject(NavController);

  protected currentPoint = toSignal(this.gameService.currentGamePoint);
  protected allPlayed = toSignal(this.gameService.allPlayed);

  protected videoUrl = computed(() => {
    const pointCode = this.currentPoint()?.code;
    return pointCode ? `assets/video/fire_points/${pointCode}.mp4` : '';
  });

  protected style = computed(() => {
    const pointCode = this.currentPoint()?.code;
    return pointCode
      ? {
          backgroundImage: `url(/assets/img/fire_points/backgrounds/${pointCode}.png)`,
        }
      : {};
  });

  protected videoEnded(): void {
    this.gameService.playCurrentFirePoint();

    this.navController.navigateRoot([
      APP_ROUTES.GAME,
      this.allPlayed() ? APP_ROUTES.GAME_SUMMARY : APP_ROUTES.FIRE_POINTS_LIST,
    ]);
  }

  protected endVideo(): void {
    if (this.video) {
      this.video.nativeElement.pause();
      this.videoEnded();
    }
  }
}
