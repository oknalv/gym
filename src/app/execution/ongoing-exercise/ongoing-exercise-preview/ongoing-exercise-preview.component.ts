import { Component, computed, inject, input } from '@angular/core';
import { OngoingExerciseComponent } from '../ongoing-exercise.component';
import { setToString } from '../../../utils';
import { Exercise } from '../../../gym.model';
import { ExecutionService } from '../../../execution.service';
import { TimerComponent } from '../../../shared/timer/timer.component';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'gym-ongoing-exercise-preview',
  imports: [TimerComponent, IconComponent],
  templateUrl: './ongoing-exercise-preview.component.html',
  styleUrl: './ongoing-exercise-preview.component.scss',
})
export class OngoingExercisePreviewComponent {
  exercises = input.required<Exercise[]>();
  executionService = inject(ExecutionService);
  setIndex = computed(() => {
    return this.executionService.ongoingExecution()!.setIndex;
  });
  restingStart = computed(() => {
    return this.executionService.ongoingExecution()!.restingStart;
  });
  setTexts = computed(() => {
    return this.exercises().map((exercise) =>
      setToString(
        exercise.sets[this.setIndex()],
        exercise.weighted,
        exercise.progressType,
      ),
    );
  });
}
