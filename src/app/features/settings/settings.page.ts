import { Component, inject, signal } from '@angular/core';
import { NavController, ViewDidEnter } from '@ionic/angular';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogModalComponent } from '../../components/dialog-modal.component/dialog-modal.component';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { GAME_DIFFICULTY, LANGUAGES, SETTINGS_OPTIONS } from '../../core/constants/settings.constants';
import { RadioOption } from '../../core/models/settings.model';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrl: 'settings.page.scss',
  imports: [
    IonCardTitle,
    IonIcon,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonCardHeader,
    IonTitle,
    IonHeader,
    IonContent,
    IonToolbar,
    IonButtons,
    IonBackButton,
    TranslateModule,
    IonCard,
    IonCardContent,
    IonFooter,
  ],
})
export class SettingsPage implements ViewDidEnter {
  private readonly settingsService = inject(SettingsService);
  private readonly translateService = inject(TranslateService);
  private readonly modalCtrl = inject(ModalController);
  private readonly navController = inject(NavController);

  protected helpModalOpen = false;
  protected helpText = signal<string>('');
  protected settingsOptions = SETTINGS_OPTIONS;

  protected gameVersion = this.settingsService.gameVersion;

  protected languageOptions = signal<RadioOption<LANGUAGES>[]>([
    {
      value: LANGUAGES.CATALAN,
      label: 'CONFIGURATION.LANGUAGE.OPTIONS.CATALAN',
    },
    {
      value: LANGUAGES.SPANISH,
      label: 'CONFIGURATION.LANGUAGE.OPTIONS.SPANISH',
    },
  ]);
  protected languageValue = signal<LANGUAGES | undefined>(undefined);

  protected gameDifficultyOptions = signal<RadioOption<GAME_DIFFICULTY>[]>([
    {
      value: GAME_DIFFICULTY.EASY,
      label: 'CONFIGURATION.GAME_DIFFICULTY.OPTIONS.EASY',
    },
    {
      value: GAME_DIFFICULTY.MEDIUM,
      label: 'CONFIGURATION.GAME_DIFFICULTY.OPTIONS.MEDIUM',
    },
    {
      value: GAME_DIFFICULTY.HARD,
      label: 'CONFIGURATION.GAME_DIFFICULTY.OPTIONS.HARD',
    },
  ]);
  protected gameDifficultyValue = signal<GAME_DIFFICULTY | undefined>(
    undefined
  );

  ionViewDidEnter(): void {
    this.setSettingsValues();
  }

  protected returnHome() {
    this.navController.navigateRoot([APP_ROUTES.HOME]);
  }

  private setSettingsValues(): void {
    this.languageValue.set(this.settingsService.language);
    this.gameDifficultyValue.set(this.settingsService.gameDifficulty);
  }

  protected languageChange(event: CustomEvent): void {
    if (event.detail?.value) {
      this.translateService.use(event.detail.value);
      this.settingsService.language = event.detail.value;
    }
  }

  protected gameDifficultyChange(event: CustomEvent): void {
    if (event.detail?.value !== undefined) {
      this.settingsService.gameDifficulty = event.detail.value;
    }
  }

  protected async openHelp(option: SETTINGS_OPTIONS): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      componentProps: {
        content: `CONFIGURATION.${option}.HELP`,
        labelFirstButton: 'BUTTONS.CLOSE',
        showSecondButton: false,
        firstButtonFull: false,
        contentJustified: true,
      },
    });

    modal.present();
  }
}
