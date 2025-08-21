import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Geolocation, Position } from '@capacitor/geolocation';
import { NavController } from '@ionic/angular';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonList,
  IonRow,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AndroidSettings, IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { take, timer } from 'rxjs';
import { CheckGPSProgressComponent } from '../../../components/check-gps-progress/check-gps-progress.component';
import { DialogModalComponent } from '../../../components/dialog-modal.component/dialog-modal.component';
import { DIALOG_MODAL_ROLES } from '../../../components/dialog-modal.component/dialog-modal.constants';
import { BANYES_TOTAL_POINTS, CUA_TOTAL_POINTS, MORRO_TOTAL_POINTS } from '../../../core/constants/fireworks.contants';
import { GAME_MODE, MAX_GPS_CHECK_ATTEMPS } from '../../../core/constants/game.constants';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { FirePointsPoint, GameFirePoints } from '../../../core/models/fire.points.model';
import { GameService } from '../../../core/services/game.service';
import { GeoLocationUtils } from '../../../utils/geo-location.utils';

@Component({
  selector: 'app-fire-points-list',
  templateUrl: './fire-points-list.page.html',
  styleUrl: './fire-points-list.page.scss',
  imports: [
    IonChip,
    TranslateModule,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonList,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    NgStyle,
  ],
})
export class FirePointsListPage implements AfterViewInit {
  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);
  private readonly navController = inject(NavController);

  private enabledGame = toSignal(this.gameService.enabledGamePoint);
  protected gameFirePoints = toSignal(this.gameService.gameFirePoints);
  protected checkingFirePoint = toSignal(this.gameService.chekingFirePoint);
  private gameMode = this.gameService.gameMode;

  protected totalPoints =
    BANYES_TOTAL_POINTS + MORRO_TOTAL_POINTS + CUA_TOTAL_POINTS;

  private checkFirePointCounter = 0;

  private checkingFirePointModal!: HTMLIonModalElement;
  private currentPlayPoint!: GameFirePoints;

  ngAfterViewInit(): void {
    timer(0).pipe(take(1)).subscribe(() => {
      const element = document.querySelector(`#${this.enabledGame()?.code}`);
      if (element && !this.enabledGame()?.first) {
        element.scrollIntoView();
      }
    });
  }

  protected async playPoint(item: GameFirePoints): Promise<void> {
    this.currentPlayPoint = item;
    if (this.gameMode() === GAME_MODE.VIRTUAL) {
      this.navigateToPlayPoint();
    } else {
      this.checkingFirePointModal = await this.modalCtrl.create({
        component: DialogModalComponent,
        cssClass: 'app-modal',
        keyboardClose: false,
        backdropDismiss: false,
        componentProps: {
          content: 'GAME.CHECKING_GPS_INFO',
          showFirstButton: false,
          showSecondButton: false,
          component: CheckGPSProgressComponent
        },
      });

      this.checkingFirePointModal.present();

      this.checkFirePointCounter = 0;
      this.updateGPSProgressAndCheckDistance();
    }
  }

  private navigateToPlayPoint(): void {
    this.gameService.setCurrentGamePoint(this.currentPlayPoint);
    this.navController.navigateRoot([
      APP_ROUTES.GAME,
      APP_ROUTES.GAME_FIRE_POINT,
    ]);
  }

  private async closeProgressAndShowError(): Promise<void> {
    this.checkingFirePointModal?.dismiss();
    this.showDialogModal(`GAME.ERROR_GET_FIRE_POINT`);
  }

  private async checkDistanceFirePoint(): Promise<void> {
    if (this.checkFirePointCounter > MAX_GPS_CHECK_ATTEMPS) {
      timer(500).pipe(take(1)).subscribe(() => {
        this.closeProgressAndShowError();
      });
    } else {
      this.gameService.updateCheckingFirePoint(true);
      Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0 })
        .then((data: Position) => {
          this.checkDataFirePoint(data);
        })
        .catch(() => {
          this.updateGPSProgressAndCheckDistance()
        })
        .finally(() => this.gameService.updateCheckingFirePoint(false));
    }
  }

  private async checkDataFirePoint(data: Position): Promise<void> {
    if (data.coords.accuracy >= 100) {
      this.checkingFirePointModal?.dismiss();

      (await this.showDialogModal('GAME.ERROR_GPS_PERMISSION', true, true) && this.openApplicationSettings());

      return;
    }

    const distancesKO = this.currentPlayPoint.points.map((item: FirePointsPoint) => {
      const distance = GeoLocationUtils.calculateDistanceMeters(
        data.coords.latitude,
        data.coords.longitude,
        item.latitude,
        item.longitude
      );

      return distance > this.currentPlayPoint.check_distance;
    });

    if (distancesKO.every(i => !!i)) {
      this.updateGPSProgressAndCheckDistance();
    } else {
      this.checkingFirePointModal?.dismiss();
      this.navigateToPlayPoint();
    }
  }

  private updateGPSProgressAndCheckDistance(): void {
    this.gameService.updateGpsCheckProgress(this.checkFirePointCounter / MAX_GPS_CHECK_ATTEMPS);
    this.checkFirePointCounter++;
    this.checkDistanceFirePoint();
  }

  private async showDialogModal(
    content: string,
    useTranslator = true,
    returnResponse = false
  ): Promise<void | boolean> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        content: content,
        labelFirstButton: 'BUTTONS.CLOSE',
        showSecondButton: false,
        firstButtonFull: false,
        contentJustified: true,
        useTranslator,
      },
    });

    modal.present();

    if (returnResponse) {
      const { role } = await modal.onDidDismiss();

      return role === DIALOG_MODAL_ROLES.FIRST;
    }
  }

  private async openApplicationSettings(): Promise<void> {
    await NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App
    });
  }
}
