import { Component, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { NavController } from '@ionic/angular';
import {
    IonButton,
    IonContent,
    IonIcon,
    ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModalComponent } from '../../components/dialog-modal.component/dialog-modal.component';
import { DIALOG_MODAL_ROLES } from '../../components/dialog-modal.component/dialog-modal.constants';
import { GAME_MODE } from '../../core/constants/game.constants';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { GameService } from '../../core/services/game.service';
import { SettingsService } from '../../core/services/settings.service';
import { LogoHomeComponent } from './components/logo-home/logo-home.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrl: './home.page.scss',
  imports: [TranslateModule, IonIcon, IonContent, IonButton, LogoHomeComponent],
})
export class HomePage {
  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);
  private readonly navController = inject(NavController);
  private readonly settingsService = inject(SettingsService);

  protected navigateConfiguration(): void {
    this.navController.navigateRoot([APP_ROUTES.CONFIGURATION]);
  }

  protected navigateInstructions(): void {
    this.navController.navigateRoot([APP_ROUTES.INSTRUCTIONS]);
  }

  private playGame(gameMode: GAME_MODE): void {
    this.modalCtrl.dismiss();
    this.gameService.gameMode = gameMode;
    this.navController.navigateRoot([APP_ROUTES.GAME]);
  }

  protected async openPlayGameModal() {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      backdropDismiss: false,
      componentProps: {
        content: 'PLAY_GAME_MODAL.TITLE',
        labelFirstButton: 'PLAY_GAME_MODAL.VIRTUAL',
        labelSecondButton: 'PLAY_GAME_MODAL.REAL',
      },
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === DIALOG_MODAL_ROLES.FIRST) {
      this.playGame(GAME_MODE.VIRTUAL);
    } else if (
      role === DIALOG_MODAL_ROLES.SECOND &&
      this.settingsService.noShowFirePointsWarning
    ) {
      this.playGame(GAME_MODE.REAL);
    } else if (role !== DIALOG_MODAL_ROLES.BACKDROP) {
      this.checkFirePointsWarning();
    }
  }

  private async checkFirePointsWarning(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      backdropDismiss: false,
      componentProps: {
        content: 'FIRE_POINTS_WARNING_MODAL.MESSAGE',
        labelFirstButton: 'BUTTONS.ACCEPT',
        showSecondButton: false,
        firstButtonFull: false,
        contentJustified: true,
        confirmToggleStr: 'TXT.NOT_SHOW_AGAIN',
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    this.settingsService.noShowFirePointsWarning = !!data?.toggleValue;

    this.playGame(GAME_MODE.REAL);
  }

  protected checkInstructionsValues(): void {
    const values = this.settingsService.instructionsValues;

    if (values.noShowInstructionsReaded || values.instructionsReaded) {
      this.openPlayGameModal();
    } else {
      this.openCheckInstructionsModal();
    }
  }

  private async openCheckInstructionsModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      backdropDismiss: false,
      componentProps: {
        content: 'CHECK_INSTRUCTIONS_MODAL.MESSAGE',
        labelFirstButton: 'BUTTONS.YES',
        labelSecondButton: 'BUTTONS.NO',
        confirmToggleStr: 'TXT.NOT_SHOW_AGAIN',
      },
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    this.settingsService.instructionsValues = {
      ...this.settingsService.instructionsValues,
      noShowInstructionsReaded: data?.toggleValue,
    };

    if (role === DIALOG_MODAL_ROLES.FIRST) {
      this.navigateInstructions();
    } else if (role === DIALOG_MODAL_ROLES.SECOND) {
      this.openPlayGameModal();
    }
  }

  protected async openExitGameConfirmModal() {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      backdropDismiss: false,
      componentProps: {
        content: 'TXT.CONFIRM_EXIT_GAME',
        labelFirstButton: 'BUTTONS.YES',
        labelSecondButton: 'BUTTONS.NO',
      },
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if (role === DIALOG_MODAL_ROLES.FIRST) {
      App.exitApp();
    }
  }
}
