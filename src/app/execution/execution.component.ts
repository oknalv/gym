import { Component, computed, inject } from '@angular/core';
import { ExecutionService } from '../execution.service';
import { WorkoutService } from '../workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { asExercise, asSuperset, isExercise } from '../utils';
import { ExerciseOptionComponent } from './exercise-option/exercise-option.component';
import { SupersetOptionComponent } from './superset-option/superset-option.component';
import { OngoingExerciseComponent } from './ongoing-exercise/ongoing-exercise.component';
import { OngoingSupersetComponent } from './ongoing-superset/ongoing-superset.component';
import { IconComponent } from '../shared/icon/icon.component';

@Component({
  selector: 'gym-execution',
  imports: [
    TranslatePipe,
    ExerciseOptionComponent,
    SupersetOptionComponent,
    OngoingExerciseComponent,
    OngoingSupersetComponent,
    IconComponent,
  ],
  templateUrl: './execution.component.html',
  styleUrl: './execution.component.scss',
})
export class ExecutionComponent {
  private executionService = inject(ExecutionService);
  private workoutService = inject(WorkoutService);
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
  ongoingExercise = computed(() => {
    if (!this.execution()) return null;
    return this.workout()?.exercises.find(
      (exercise) => exercise.id === this.execution()!.ongoingExerciseId,
    );
  });

  mustChooseExercise = computed(() => {
    if (!this.execution()) return false;
    return (
      this.execution()!.ongoingExerciseId === null &&
      this.workout()!.exercises.length >
        this.execution()!.completedExerciseIds.length
    );
  });

  mustPerformSet = computed(() => {
    if (!this.execution()) return false;
    return (
      this.execution()!.ongoingExerciseId !== null &&
      this.execution()!.restingStart === null
    );
  });

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;

  onChooseExercise(exerciseId: number) {
    this.executionService.startExercise(exerciseId);
  }

  onAbandonExercise() {
    this.executionService.abandonExercise();
  }
}
