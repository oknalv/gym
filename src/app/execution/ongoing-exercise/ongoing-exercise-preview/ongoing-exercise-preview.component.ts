import { Component, computed } from '@angular/core';
import { OngoingExerciseComponent } from '../ongoing-exercise.component';
import { setToString } from '../../../utils';

@Component({
  selector: 'gym-ongoing-exercise-preview',
  imports: [],
  templateUrl: './ongoing-exercise-preview.component.html',
  styleUrl: './ongoing-exercise-preview.component.scss',
})
export class OngoingExercisePreviewComponent extends OngoingExerciseComponent {
  setText = computed(() => {
    return setToString(
      this.set(),
      this.exercise().weighted,
      this.exercise().progressType,
    );
  });
}
