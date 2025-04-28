import { Component, input } from '@angular/core';
import { ExerciseSet, ProgressType, WeightType } from '../../exercise.model';

@Component({
  selector: 'gym-set',
  imports: [],
  templateUrl: './set.component.html',
  styleUrl: './set.component.scss',
})
export class SetComponent {
  set = input.required<ExerciseSet>();
  weighted = input.required<boolean>();
  progressType = input.required<ProgressType>();

  get text() {
    return this.weight + this.progress;
  }

  get weight() {
    return this.weighted() ? `${this.set().weight} kg × ` : '';
  }

  get progress() {
    return this.progressType() === 'repetitions'
      ? `${this.set().repetitions} reps`
      : `${this.set().time} secs`;
  }
}
