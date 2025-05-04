import { Component, computed, inject, input } from '@angular/core';
import { Exercise } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { TimePipe } from '../../shared/pipes/time/time.pipe';
import { ExecutionActionsComponent } from '../execution-actions/execution-actions.component';
import { ExecutionService } from '../../execution.service';

@Component({
  selector: 'gym-ongoing-exercise',
  imports: [
    ExerciseImageComponent,
    TranslatePipe,
    IconComponent,
    TimePipe,
    ExecutionActionsComponent,
  ],
  templateUrl: './ongoing-exercise.component.html',
  styleUrl: './ongoing-exercise.component.scss',
})
export class OngoingExerciseComponent {
  exercise = input.required<Exercise>();
  executionService = inject(ExecutionService);
  setIndex = computed(() => {
    return this.executionService.ongoingExecution()!.setIndex;
  });
  isLastSet = computed(() => {
    return this.exercise().sets.length - 1 === this.setIndex();
  });
  set = computed(() => {
    return this.exercise().sets[this.setIndex()];
  });
}
