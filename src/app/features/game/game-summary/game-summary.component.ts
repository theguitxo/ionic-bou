import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Media } from '@capacitor-community/media';
import { ModalController } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Screenshot } from 'capacitor-screenshot';
import { take, timer } from 'rxjs';
import { DialogModalComponent } from '../../../components/dialog-modal.component/dialog-modal.component';
import { SCORES_ALBUM_IDENTIFIER } from '../../../core/constants/game.constants';
import { GameScoresSummary } from '../../../core/models/game.summary.model';
import { GameService } from '../../../core/services/game.service';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrl: './game-summary.component.scss',
  imports: [TranslateModule, NgClass],
})
export class GameSummaryComponent {
  private readonly gameService = inject(GameService);
  private readonly modalCtrl = inject(ModalController);

  protected showCaptureButton = signal(true);

  protected summaryScores = toSignal(this.gameService.summaryScores);

  protected totalScore = computed<number>(() => this.summaryScores()?.reduce((previous: number, current: GameScoresSummary) => previous + (current?.score ?? 0), 0) ?? 0);

  protected saveScores() {
    this.showCaptureButton.set(false);
    this.gameService.showExitButton = false;

    timer(0).pipe(take(1)).subscribe(() => this.saveOnGallery());
  }

  private async saveOnGallery() {
    try {
      const result = await Screenshot.take();
      
      if (!result || !result.base64) {
        throw new Error('GAME.SUMMARY.ERROR_GET_IMAGE');
      }

      const base64Image = `data:image/png;base64,${result.base64}`;

      const albumId = await this.getAlbumIdentifier(SCORES_ALBUM_IDENTIFIER);

      await Media.savePhoto({
        path: base64Image,
        albumIdentifier: albumId
      });

      this.showDialogMessage('GAME.SUMMARY.SCORES_IMAGE_SAVED');
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('permission')) {
        this.showDialogMessage('GAME.SUMMARY.MUST_ENABLE_GALLERY_PERMISSION');
      } else {
        this.showDialogMessage(error?.message ?? 'GAME.SUMMARY.ERROR_SAVING_IMAGE');
      }
    } finally {
      this.showCaptureButton.set(true);
      this.gameService.showExitButton = true;
    }
  }

  async getAlbumIdentifier(name: string): Promise<string> {
    const { albums: currentAlbums } = await Media.getAlbums();
    const albumExists = currentAlbums.find(a => a.name === name);

    if (albumExists) {
      return albumExists.identifier;
    }

    await Media.createAlbum({ name: name });
    
    const { albums: updatedAlbums } = await Media.getAlbums();
    const newAlbum = updatedAlbums.find(a => a.name === name);

    if (!newAlbum) {
      throw new Error('GAME.SUMMARY.ERROR_GET_ALBUM');
    }

    return newAlbum.identifier;
  }

  private async showDialogMessage(message: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: DialogModalComponent,
      cssClass: 'app-modal',
      keyboardClose: false,
      backdropDismiss: false,
      componentProps: {
        content: message,
        labelFirstButton: 'BUTTONS.CLOSE',
        showSecondButton: false,
        firstButtonFull: false,
        contentJustified: true,
        useTranslator: true
      }
    });

    modal.present();
  }
}
