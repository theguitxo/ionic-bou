import { Component, computed, OnInit, signal } from '@angular/core';
import { FIREWORKS_POINTS } from '../../../../../core/constants/fireworks.contants';
import { FIREWORKS_TYPES } from '../../../../../core/models/fireworks.points.model';
import { FirePointDirective } from '../fire-point.class';

@Component({
  selector: 'app-back-fire-points',
  templateUrl: './back-fire-points.component.html',
  styleUrl: './back-fire-points.component.scss',
})
export class BackFirePointsComponent
  extends FirePointDirective
  implements OnInit
{
  ngOnInit(): void {
    this.fireworksPointsPosition = 'BACK';
    this.initFireworkPointsValues();
  }

  private initFireworkPointsValues(): void {
    this.fireworkPointsValues = signal(
      this.points
        ? new Map<FIREWORKS_POINTS, undefined | FIREWORKS_TYPES>([
            [FIREWORKS_POINTS.CUA_1, this.points?.CUA[0]],
            [FIREWORKS_POINTS.CUA_2, this.points?.CUA[1]],
            [FIREWORKS_POINTS.CUA_3, this.points?.CUA[2]],
          ])
        : undefined
    );
  }

  protected point_1 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.CUA[0])
  );

  protected point_2 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.CUA[1])
  );

  protected point_3 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.CUA[2])
  );
}
