import { Component, computed, OnInit, signal } from '@angular/core';
import { FIREWORKS_POINTS } from '../../../../../core/constants/fireworks.contants';
import { FIREWORKS_TYPES } from '../../../../../core/models/fireworks.points.model';
import { FirePointDirective } from '../fire-point.class';

@Component({
  selector: 'app-head-fire-points',
  templateUrl: './head-fire-points.component.html',
  styleUrl: './head-fire-points.component.scss',
})
export class HeadFirePointsComponent
  extends FirePointDirective
  implements OnInit
{
  ngOnInit(): void {
    this.fireworksPointsPosition = 'HEAD';
    this.initFireworkPointsValues();
  }

  private initFireworkPointsValues(): void {
    this.fireworkPointsValues = signal(
      this.points
        ? new Map<FIREWORKS_POINTS, undefined | FIREWORKS_TYPES>([
            [FIREWORKS_POINTS.BANYES_1, this.points?.BANYES[0]],
            [FIREWORKS_POINTS.BANYES_2, this.points?.BANYES[1]],
            [FIREWORKS_POINTS.MORRO_1, this.points?.MORRO[0]],
            [FIREWORKS_POINTS.MORRO_2, this.points?.MORRO[1]],
            [FIREWORKS_POINTS.MORRO_3, this.points?.MORRO[2]],
            [FIREWORKS_POINTS.MORRO_4, this.points?.MORRO[3]],
            [FIREWORKS_POINTS.MORRO_5, this.points?.MORRO[4]],
            [FIREWORKS_POINTS.MORRO_6, this.points?.MORRO[5]],
            [FIREWORKS_POINTS.MORRO_7, this.points?.MORRO[6]],
          ])
        : undefined
    );
  }

  protected banyes_1 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.BANYES[0])
  );
  protected banyes_2 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.BANYES[1])
  );
  protected morro_1 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[0])
  );
  protected morro_2 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[1])
  );
  protected morro_3 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[2])
  );
  protected morro_4 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[3])
  );
  protected morro_5 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[4])
  );
  protected morro_6 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[5])
  );
  protected morro_7 = computed<{ [key: string]: boolean }>(() =>
    this.setFirePointValues(this.points?.MORRO[6])
  );
}
