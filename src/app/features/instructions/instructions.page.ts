import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import {
  IonContent,
  IonFooter,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Swiper from 'swiper';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { InstructionsItem, InstructionsObject, InstructionsObjectData, InstructionsSlide } from '../../core/models/instructions.model';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.page.html',
  styleUrl: './instructions.page.scss',
  imports: [TranslateModule, IonContent, IonFooter, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InstructionsPage
  implements ViewWillEnter, ViewWillLeave, AfterViewInit {
  @ViewChild('instructionsSwiper') instructionsSwiper: ElementRef | undefined;

  private readonly navController = inject(NavController);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translateService = inject(TranslateService);
  private readonly settingsService = inject(SettingsService);

  private swiper!: Swiper;

  protected slidesInfo = signal<InstructionsSlide[]>([]);

  ionViewWillEnter(): void {
    this.httpClient
      .get('assets/instructions.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: Object) => {
        this.setSlidesInfo(data as InstructionsObjectData[]) ?? [];
      });
  }

  ngAfterViewInit(): void {
    if (this.instructionsSwiper) {
      this.swiper = this.instructionsSwiper.nativeElement.swiper;
    }

    this.initSlideChangeEvent();
  }

  ionViewWillLeave(): void {
    this.swiper?.destroy();
  }

  private initSlideChangeEvent(): void {
    this.swiper.on('slideChange', (event) => {
      if (event.activeIndex === (event.slides?.length ?? 0) - 1) {
        this.settingsService.instructionsValues = {
          ...this.settingsService.instructionsValues,
          instructionsReaded: true,
        };
      }
    });
  }

  private setSlidesInfo(data: InstructionsObjectData[]): void {
    this.slidesInfo.set(
      data.map((item: InstructionsObjectData) => {
        return {
          objects: item.objects?.map((data: InstructionsObject) =>
            this.parseSlideInfo(data),
          ),
        };
      }),
    );
  }

  private parseSlideInfo(data: InstructionsObject): InstructionsItem {
    const item: InstructionsItem = {
      type: data.type,
      value: this.parseValueFromSlideInfo(data),
      imageAlignement:
        data.imageAlignement ?? (data.type === 'image' ? 'center' : undefined),
    };

    return item;
  }

  private parseValueFromSlideInfo(data: InstructionsObject): string | SafeHtml {
    let value: string | SafeHtml;

    switch (data.type) {
      case 'title':
      case 'text':
        value = data.translationKey
          ? this.translateService.instant(data.translationKey)
          : '';
        break;
      case 'html':
        value = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent ?? '');
        break;
      case 'image':
        if (!data.imageWithLang) {
          value = data.url ?? '';
        } else {
          const key = `url${this.settingsService.language?.toUpperCase()}`;
          value = data[key as keyof InstructionsObject] ?? '';
        }
        break;
    }

    return value;
  }

  protected goHome(): void {
    this.navController.navigateRoot([APP_ROUTES.HOME]);
  }
}
