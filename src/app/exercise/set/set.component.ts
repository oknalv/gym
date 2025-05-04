import { Component, computed, input } from '@angular/core';
import { ExerciseSet, ProgressType } from '../../gym.model';
import { setToString } from '../../utils';

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
  text = computed(() => {
    return setToString(this.set(), this.weighted(), this.progressType());
  });
}
