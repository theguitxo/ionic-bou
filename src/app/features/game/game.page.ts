import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavController } from '@ionic/angular';
import {
    IonContent,
    IonFooter,
    IonRouterOutlet,
    ModalController,
    Platform,
    ViewDidEnter,
    ViewWillEnter,
    ViewWillLeave,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DialogModalComponent } from '../../components/dialog-modal.component/dialog-modal.component';
import { DIALOG_MODAL_ROLES } from '../../components/dialog-modal.component/dialog-modal.constants';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { GameService } from '../../core/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: 'game.page.html',
  styleUrl: './game.page.scss',
  imports: [IonContent, IonRouterOutlet, TranslateModule, IonFooter],
})
export class GamePage implements ViewWillEnter, ViewDidEnter, ViewWillLeave {
  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);
  private readonly platform = inject(Platform);
  private readonly navController = inject(NavController);

  protected gameFirePoints = toSignal(this.gameService.gameFirePoints);
  protected checkingFirePoint = toSignal(this.gameService.chekingFirePoint);

  private subscription!: Subscription;
  private allPlayed = toSignal(this.gameService.allPlayed);

  protected showExitButton = this.gameService.showExitButton;
  
  ionViewWillEnter(): void {
    this.gameService.generateGame();
  }

  ionViewDidEnter(): void {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      0,
      async () => (await this.openExitGameModal()) && this.exitGame(),
    );
  }

  ionViewWillLeave(): void {
    this.subscription.unsubscribe();
  }

  private exitGame(): void {
    this.gameService.finishGame();
    this.navController.navigateRoot([APP_ROUTES.HOME]);
  }

  protected async checkExitGameModal(): Promise<void> {
    if (this.allPlayed()) {
      this.exitGame();
    } else if (await this.openExitGameModal()) {
      this.exitGame();
    }
  }
  protected async openExitGameModal(): Promise<boolean> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        content: 'EXIT_GAME_MODAL.TITLE',
        labelFirstButton: 'BUTTONS.YES',
        labelSecondButton: 'BUTTONS.NO',
      },
    });

    modal.present();

    const { role } = await modal.onDidDismiss();

    return role === DIALOG_MODAL_ROLES.FIRST;
  }
}
