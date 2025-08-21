import { DecimalPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { IonProgressBar } from "@ionic/angular/standalone";
import { GameService } from "../../core/services/game.service";

@Component({
    selector: 'app-check-gps-progress',
    templateUrl: './check-gps-progress.component.html',
    imports: [
        IonProgressBar,
        DecimalPipe
    ]
})
export class CheckGPSProgressComponent {
    private readonly gameService = inject(GameService);
    protected gpsProgress = toSignal<number>(this.gameService.gpsCheckProgress);
}