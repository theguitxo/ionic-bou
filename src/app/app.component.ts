
import { DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { App } from '@capacitor/app';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Platform } from '@ionic/angular';
import { IonApp, IonProgressBar, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { register } from 'swiper/element/bundle';
import { APP_ICONS } from './core/constants/icons.constant';
import { ImagePreloaderService } from './core/services/image.preloader.service';
import { SettingsService } from './core/services/settings.service';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [
    IonApp, IonRouterOutlet, IonProgressBar,
    DecimalPipe, TranslateModule
  ],
})
export class AppComponent implements OnInit {
  private readonly platform = inject(Platform);
  private readonly translateService = inject(TranslateService);
  private readonly settingsService = inject(SettingsService);
  private readonly preloader = inject(ImagePreloaderService);

  protected isLoading = signal<boolean>(true);
  protected loadProgress = signal<number>(0);

  private imagesToPreload: string[] = [
    'assets/img/fire_points/avatars/cafes.png',
    'assets/img/fire_points/avatars/lira.png',
    'assets/img/fire_points/avatars/muralla.png',
    'assets/img/fire_points/avatars/pl_nova.png',
    'assets/img/fire_points/avatars/pl_vella.png',
    'assets/img/fire_points/avatars/pont_fransa.png',
    'assets/img/fire_points/avatars/quatre_fonts.png',
    'assets/img/fire_points/avatars/rambla.png',
    'assets/img/fire_points/avatars/rasa_sola.png',
    'assets/img/fire_points/avatars/roquetes.png',
    'assets/img/fire_points/backgrounds/cafes.png',
    'assets/img/fire_points/backgrounds/lira.png',
    'assets/img/fire_points/backgrounds/muralla.png',
    'assets/img/fire_points/backgrounds/pl_nova.png',
    'assets/img/fire_points/backgrounds/pl_vella.png',
    'assets/img/fire_points/backgrounds/pont_fransa.png',
    'assets/img/fire_points/backgrounds/quatre_fonts.png',
    'assets/img/fire_points/backgrounds/rambla.png',
    'assets/img/fire_points/backgrounds/rasa_sola.png',
    'assets/img/fire_points/backgrounds/roquetes.png',
    'assets/img/fire_points/headers/cafes.png',
    'assets/img/fire_points/headers/lira.png',
    'assets/img/fire_points/headers/muralla.png',
    'assets/img/fire_points/headers/pl_nova.png',
    'assets/img/fire_points/headers/pl_vella.png',
    'assets/img/fire_points/headers/pont_fransa.png',
    'assets/img/fire_points/headers/quatre_fonts.png',
    'assets/img/fire_points/headers/rambla.png',
    'assets/img/fire_points/headers/rasa_sola.png',
    'assets/img/fire_points/headers/roquetes.png',
    'assets/img/fireworks/places/banyes_1.png',
    'assets/img/fireworks/places/banyes_2.png',
    'assets/img/fireworks/places/cua_1.png',
    'assets/img/fireworks/places/cua_2.png',
    'assets/img/fireworks/places/cua_3.png',
    'assets/img/fireworks/places/morro_1.png',
    'assets/img/fireworks/places/morro_2.png',
    'assets/img/fireworks/places/morro_3.png',
    'assets/img/fireworks/places/morro_4.png',
    'assets/img/fireworks/places/morro_5.png',
    'assets/img/fireworks/places/morro_6.png',
    'assets/img/fireworks/places/morro_7.png',
    'assets/img/fireworks/types/carretilla.svg',
    'assets/img/fireworks/types/cracker.svg',
    'assets/img/fireworks/types/roncador.svg',
    'assets/img/fireworks/types/sortidor.svg',
    'assets/img/fireworks/types/supercarretilla.svg',
    'assets/img/fireworks/types/volcanet.svg',
    'assets/img/instructions/slide_1_image_1.svg',
    'assets/img/instructions/slide_2_image_1.svg',
    'assets/img/instructions/slide_3_image_1.svg',
    'assets/img/instructions/slide_4_image_1.svg',
    'assets/img/instructions/slide_4_image_2_ca.png',
    'assets/img/instructions/slide_4_image_2_es.png',
    'assets/img/instructions/slide_4_image_3_ca.png',
    'assets/img/instructions/slide_4_image_3_es.png',
    'assets/img/instructions/slide_4_image_4_ca.png',
    'assets/img/instructions/slide_4_image_4_es.png',
    'assets/img/instructions/slide_4_image_5_ca.png',
    'assets/img/instructions/slide_4_image_5_es.png',
    'assets/img/instructions/slide_4_image_6_ca.png',
    'assets/img/instructions/slide_4_image_6_es.png',
    'assets/img/instructions/slide_4_image_7_ca.png',
    'assets/img/instructions/slide_4_image_7_es.png',
    'assets/img/instructions/slide_5_image_1_ca.png',
    'assets/img/instructions/slide_5_image_1_es.png',
    'assets/img/instructions/slide_6_image_1.svg',
    'assets/img/instructions/slide_6_image_2_ca.svg',
    'assets/img/instructions/slide_6_image_2_es.svg',
    'assets/img/instructions/slide_6_image_3_ca.svg',
    'assets/img/instructions/slide_6_image_3_es.svg',
    'assets/img/instructions/slide_7_image_1.svg',
    'assets/img/instructions/slide_8_image_1.svg',
    'assets/img/summary.svg',
    'assets/img/logo_bou.svg'
  ]
  constructor() {
    this.settingsService.loadSettings();
    this.settingsService.loadAppValues();
    this.translateService.use(this.settingsService.language);

    addIcons(APP_ICONS);
  }

  async ngOnInit(): Promise<void> {
    if (this.platform.is('capacitor')) {
      const appInfo = await App.getInfo();

      this.settingsService.gameVersion = appInfo.version;

      await ScreenOrientation.lock({ orientation: 'portrait' });
    }

    this.preloadImages();
  }

  private preloadImages(): void {
    this.preloader.getDownloadProgress().subscribe((progress) => {
      this.loadProgress.set(progress);
    });

    this.preloader.preloadImages(this.imagesToPreload).then(() => {
      this.isLoading.set(false);
    });
  }
}
