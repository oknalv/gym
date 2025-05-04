import { Component, computed, inject, input, signal } from '@angular/core';
import { Exercise } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { TimePipe } from '../../shared/pipes/time/time.pipe';
import { ExecutionActionsComponent } from '../execution-actions/execution-actions.component';
import { ExecutionService } from '../../execution.service';
import { TimerDialogComponent } from '../../shared/dialog/timer-dialog/timer-dialog.component';
import { OngoingSetComponent } from './ongoing-set/ongoing-set.component';

@Component({
  selector: 'gym-ongoing-exercise',
  imports: [
    ExerciseImageComponent,
    TranslatePipe,
    ExecutionActionsComponent,
    OngoingSetComponent,
  ],
  templateUrl: './ongoing-exercise.component.html',
  styleUrl: './ongoing-exercise.component.scss',
})
export class OngoingExerciseComponent {
  exercise = input.required<Exercise>();
  executionService = inject(ExecutionService);
  showTimer = signal(false);
  setIndex = computed(() => {
    return this.executionService.ongoingExecution()!.setIndex;
  });
  isLastSet = computed(() => {
    return this.exercise().sets.length - 1 === this.setIndex();
  });
  set = computed(() => {
    return this.exercise().sets[this.setIndex()];
  });

  onRunTimer() {
    this.showTimer.set(true);
  }
}
