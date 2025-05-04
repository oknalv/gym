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
  _elementKey = computed(() => {
    return `execution.${this.elementKey()}`;
  });
  isLastSet = input.required<boolean>();
  restingTime = input.required<number>();
  private executionService = inject(ExecutionService);
  restingStart = computed(() => {
    return this.executionService.ongoingExecution()!.restingStart;
  });

  onAbandonExercise() {
    this.executionService.abandonExercise();
  }

  onSkipExercise() {
    this.executionService.completeExercise();
  }

  onRest() {
    console.log('here');
    this.executionService.rest();
  }

  onSkipRest() {
    if (this.isLastSet()) {
      this.executionService.completeExercise();
    } else {
      this.executionService.nextSet();
    }
  }
}
