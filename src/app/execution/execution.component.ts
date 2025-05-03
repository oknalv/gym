import { Component, computed, effect, inject, signal } from '@angular/core';
import { ExecutionService } from '../execution.service';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'gym-execution',
  imports: [],
  templateUrl: './execution.component.html',
  styleUrl: './execution.component.scss',
})
export class ExecutionComponent {
  executionService = inject(ExecutionService);
  workoutService = inject(WorkoutService);
  execution = this.executionService.ongoingExecution;
  workout = computed(() => {
    if (this.execution()) {
      const workout = this.workoutService
        .workouts()
        .find((workout) => workout.id === this.execution()!.workoutId);
      return workout;
    }
    return null;
  });

  constructor() {}
}
