import { Component, computed, inject, input } from '@angular/core';
import { setToString } from '../../../utils';
import { Exercise } from '../../../gym.model';
import { ExecutionService } from '../../../services/execution.service';
import { TimerComponent } from '../../../shared/timer/timer.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ConfigurationService } from '../../../services/configuration.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-ongoing-exercise-preview',
  imports: [TimerComponent, IconComponent, TranslatePipe],
  templateUrl: './ongoing-exercise-preview.component.html',
  styleUrl: './ongoing-exercise-preview.component.scss',
})
export class OngoingExercisePreviewComponent {
  timerId = input.required<string>();
  exercises = input.required<Exercise[]>();
  private executionService = inject(ExecutionService);
  private configurationService = inject(ConfigurationService);
  private weightUnit = computed(() => {
    return this.configurationService.configuration().weightUnit;
  });
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
        this.weightUnit(),
      ),
    );
  });

  onFinishRest() {
    if (
      this.exercises()[0].sets.length - 1 ===
      this.executionService.ongoingExecution()?.setIndex
    )
      this.executionService.completeExercise();
    else this.executionService.nextSet();
  }
}
