import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Input, OnInit, signal, Type } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IonToggle, ModalController } from '@ionic/angular/standalone';
import { ToggleChangeEventDetail } from '@ionic/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DIALOG_MODAL_ROLES } from './dialog-modal.constants';
import { DailogModalData } from './dialog-modal.model';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './dialog-modal.component.html',
  imports: [TranslateModule, IonToggle, NgComponentOutlet],
})
export class DialogModalComponent implements OnInit {
  @Input() content!: string;
  @Input() showFirstButton = true;
  @Input() showSecondButton = true;
  @Input() labelFirstButton!: string;
  @Input() labelSecondButton!: string;
  @Input() firstButtonFull = true;
  @Input() secondButtonFull = true;
  @Input() contentJustified = false;
  @Input() useTranslator = true;
  @Input() confirmToggleStr!: string;
  @Input() component!: Type<any>;

  private readonly modalCtrl = inject(ModalController);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly translateService = inject(TranslateService);

  protected sanitizedContent!: SafeHtml;

  protected showToggle = signal<boolean>(false);
  private toggleValue = false;

  ngOnInit(): void {
    const message = this.useTranslator
      ? this.translateService.instant(this.content)
      : this.content;

    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(message);

    this.showToggle.set(!!this.confirmToggleStr);
  }

  protected handleClickFirstButton(): void {
    this.modalCtrl.dismiss(this.setDialogData(), DIALOG_MODAL_ROLES.FIRST);
  }

  protected handleClickSecondButton(): void {
    this.modalCtrl.dismiss(this.setDialogData(), DIALOG_MODAL_ROLES.SECOND);
  }

  private setDialogData(): DailogModalData {
    const values: DailogModalData = {
      toggleValue: this.toggleValue,
    };

    return values;
  }

  protected toggleValueChanges(
    event: CustomEvent<ToggleChangeEventDetail>,
  ): void {
    this.toggleValue = event.detail.checked;
  }
}
