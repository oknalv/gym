import { Component, computed, inject, input } from '@angular/core';
import { Superset } from '../../gym.model';
import { OngoingSupersetExerciseComponent } from '../ongoing-exercise/ongoing-superset-exercise/ongoing-superset-exercise.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ExecutionActionsComponent } from '../execution-actions/execution-actions.component';
import { ExecutionService } from '../../execution.service';

@Component({
  selector: 'gym-ongoing-superset',
  imports: [
    OngoingSupersetExerciseComponent,
    TranslatePipe,
    ExecutionActionsComponent,
  ],
  templateUrl: './ongoing-superset.component.html',
  styleUrl: './ongoing-superset.component.scss',
})
export class OngoingSupersetComponent {
  superset = input.required<Superset>();
  executionService = inject(ExecutionService);
  setIndex = computed(() => {
    return this.executionService.ongoingExecution()!.setIndex;
  });
  isLastSet = computed(() => {
    return this.superset().exercises[0].sets.length - 1 === this.setIndex();
  });
}
