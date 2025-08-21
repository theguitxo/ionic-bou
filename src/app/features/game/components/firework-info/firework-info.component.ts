import { Component, computed, inject, Input, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FIREWORKS_IMAGES_TYPES_PATH } from '../../../../core/constants/fireworks.contants';
import { FIREWORKS_TYPES } from '../../../../core/models/fireworks.points.model';

@Component({
  selector: 'app-firework-info',
  templateUrl: './firework-info.component.html',
  styleUrl: './firework-info.component.scss',
  imports: [TranslateModule],
  providers: [ModalController],
})
export class FireworkInfoComponent {
  @Input({ required: true }) firework!: FIREWORKS_TYPES;

  private readonly modalCtrl = inject(ModalController);

  private IMAGES_PATH = FIREWORKS_IMAGES_TYPES_PATH;

  protected name = computed<string>(() => `FIREWORKS.${this.firework}.NAME`);
  protected description = computed<string>(
    () => `FIREWORKS.${this.firework}.DESCRIPTION`
  );

  protected fireworksImages = signal(
    new Map<FIREWORKS_TYPES, string>([
      ['CARRETILLA', `${this.IMAGES_PATH}/carretilla.svg`],
      ['CRACKER', `${this.IMAGES_PATH}/cracker.svg`],
      ['RONCADOR', `${this.IMAGES_PATH}/roncador.svg`],
      ['SORTIDOR', `${this.IMAGES_PATH}/sortidor.svg`],
      ['SUPER_CARRETILLA', `${this.IMAGES_PATH}/supercarretilla.svg`],
      ['VOLCANET', `${this.IMAGES_PATH}/volcanet.svg`],
    ])
  );

  protected closeModal(): void {
    this.modalCtrl.dismiss();
  }
}
