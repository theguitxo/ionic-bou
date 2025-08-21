import {
    AfterViewInit,
    Component,
    computed,
    CUSTOM_ELEMENTS_SCHEMA,
    DestroyRef,
    ElementRef,
    inject,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavController } from '@ionic/angular';
import {
    IonAccordionGroup,
    IonAvatar,
    ModalController,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Swiper } from 'swiper';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { GameFirePoints } from '../../../core/models/fire.points.model';
import { FIREWORKS_POINTS_POSITIONS, FIREWORKS_TYPES } from '../../../core/models/fireworks.points.model';
import { GameService } from '../../../core/services/game.service';
import { GeneralUtils } from '../../../utils/general.utils';
import { BackFirePointsComponent } from '../components/fire-points/back-fire-points/back-fire-points.component';
import { HeadFirePointsComponent } from '../components/fire-points/head-fire-points/head-fire-points.component';
import { FireworkInfoComponent } from '../components/firework-info/firework-info.component';
import { NextPreviousLabels } from './fire-combinations.model';

@Component({
  selector: 'app-fire-combinations',
  templateUrl: './fire-combinations.page.html',
  styleUrl: './fire-combinations.page.scss',
  imports: [
    TranslateModule,
    HeadFirePointsComponent,
    BackFirePointsComponent,
    IonAvatar,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FireCombinationsPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('firePointsSwiper') firePointsSwiper: ElementRef | undefined;
  @ViewChild('firePointsAccordion', { static: false })
  firePointsAccordion!: IonAccordionGroup;

  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);
  private readonly navController = inject(NavController);
  private readonly destroyRef = inject(DestroyRef);

  private swiper!: Swiper;

  protected gameFirePoints = signal<GameFirePoints[] | undefined>([]);
  private showing = signal<FIREWORKS_POINTS_POSITIONS>('HEAD');
  protected showHeadValue = computed(() => this.showing() === 'HEAD');
  protected showBackValue = computed(() => this.showing() === 'BACK');

  protected nextPreviousButtonLabel = signal<Map<number, NextPreviousLabels>>(
    new Map(),
  );

  ngOnInit(): void {
    this.gameService.gameFirePoints
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: GameFirePoints[] | undefined) =>
        this.setGamePointsInfo(data),
      );
  }

  ngAfterViewInit(): void {
    if (this.firePointsSwiper) {
      this.swiper = this.firePointsSwiper.nativeElement.swiper;
      this.swiper.allowTouchMove = false;
    }
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  private setGamePointsInfo(data: GameFirePoints[] | undefined): void {
    this.gameFirePoints.set(data);

    const labels = new Map<number, NextPreviousLabels>();

    const translateKeys = (this.gameFirePoints() ?? []).map(
      (item: GameFirePoints) => item.translateKey ?? '',
    );

    translateKeys.forEach((txt: string, index: number) => {
      labels.set(index, {
        next: GeneralUtils.IndexInArray(translateKeys, index + 1)
          ? translateKeys[index + 1]
          : '',
        previous: GeneralUtils.IndexInArray(translateKeys, index - 1)
          ? translateKeys[index - 1]
          : '',
      });
    });

    this.nextPreviousButtonLabel.set(labels);
  }

  protected showFirePointsList(): void {
    this.navController.navigateRoot([
      APP_ROUTES.GAME,
      APP_ROUTES.FIRE_POINTS_LIST,
    ]);
  }

  protected nextFirePoint(): void {
    this.showHead();
    this.swiper?.slideNext();
  }

  protected previousFirePoint(): void {
    this.showHead();
    this.swiper?.slidePrev();
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
}
