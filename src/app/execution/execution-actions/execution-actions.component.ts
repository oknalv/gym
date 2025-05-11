import { Component, computed, inject, input } from '@angular/core';
import { ExecutionService } from '../../execution.service';
import { IconComponent } from '../../shared/icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerComponent } from '../../shared/timer/timer.component';

@Component({
  selector: 'gym-execution-actions',
  imports: [IconComponent, TranslatePipe, TimerComponent],
  templateUrl: './execution-actions.component.html',
  styleUrl: './execution-actions.component.scss',
})
export class ExecutionActionsComponent {
  elementKey = input.required<string>();
  timerId = input.required<string>();
  private _elementKey = computed(() => {
    return `${this.elementKey()[0].toUpperCase()}${this.elementKey().substring(1)}`;
  });
  isLastSet = input.required<boolean>();
  isLastExercise = input.required<boolean>();
  restingTime = input.required<number>();
  private executionService = inject(ExecutionService);
  restingStart = computed(() => {
    return this.executionService.ongoingExecution()!.restingStart;
  });
  skipRestKey = computed(() => {
    let key = 'execution.skipRest';
    if (this.isLastSet()) key += 'Finish';
    if (this.isLastExercise()) key += 'Workout';
    else key += this._elementKey();
    return key;
  });
  finishSetKey = computed(() => {
    if (!this.isLastSet()) return 'execution.finishSet';
    let key = 'execution.finish' + this._elementKey();
    if (this.isLastExercise()) key = 'execution.finishWorkout';
    return key;
  });
  abandonKey = computed(() => {
    return 'execution.abandon' + this._elementKey();
  });
  skipExerciseKey = computed(() => {
    let key = 'execution.skip' + this._elementKey();
    if (this.isLastExercise()) key += 'Workout';
    return key;
  });

  onAbandonExercise() {
    this.executionService.abandonExercise();
  }

  onSkipExercise() {
    this.executionService.completeExercise();
  }

  onRest() {
    this.executionService.rest();
  }

  onFinishRest() {
    if (this.isLastSet()) this.executionService.completeExercise();
    else this.executionService.nextSet();
  }

  onSkipRest() {
    if (this.isLastSet()) {
      this.executionService.completeExercise();
    } else {
      this.executionService.nextSet();
    }
  }
}
