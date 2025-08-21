import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
    PreloadAllModules,
    RouteReuseStrategy,
    provideRouter,
    withPreloading,
} from '@angular/router';
import {
    IonicRouteStrategy,
    provideIonicAngular,
} from '@ionic/angular/standalone';

import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { GameService } from './app/core/services/game.service';
import { ImagePreloaderService } from './app/core/services/image.preloader.service';
import { SettingsService } from './app/core/services/settings.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({
      rippleEffect: false,
      mode: 'md',
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'es',
    }),
    SettingsService,
    GameService,
    ImagePreloaderService
  ],
});
