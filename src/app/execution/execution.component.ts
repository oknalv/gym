import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ExecutionService } from '../execution.service';
import { WorkoutService } from '../workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { asExercise, asSuperset, isExercise } from '../utils';
import { ExerciseOptionComponent } from './exercise-option/exercise-option.component';
import { SupersetOptionComponent } from './superset-option/superset-option.component';
import { OngoingExerciseComponent } from './ongoing-exercise/ongoing-exercise.component';
import { OngoingSupersetComponent } from './ongoing-superset/ongoing-superset.component';
import { IconComponent } from '../shared/icon/icon.component';
import { DialogComponent } from '../shared/dialog/dialog.component';

@Component({
  selector: 'gym-execution',
  imports: [
    TranslatePipe,
    ExerciseOptionComponent,
    SupersetOptionComponent,
    OngoingExerciseComponent,
    OngoingSupersetComponent,
    IconComponent,
    DialogComponent,
  ],
  templateUrl: './execution.component.html',
  styleUrl: './execution.component.scss',
})
export class ExecutionComponent {
  private executionService = inject(ExecutionService);
  private workoutService = inject(WorkoutService);
  private destroyRef = inject(DestroyRef);
  execution = this.executionService.ongoingExecution;
  showAskLeaveWorkout = signal(false);

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

  workoutFinished = computed(() => {
    if (!this.execution()) return false;
    return (
      this.workout()!.exercises.length ===
      this.execution()!.completedExerciseIds.length
    );
  });

  mustChooseExercise = computed(() => {
    if (!this.execution()) return false;
    return (
      !this.workoutFinished() && this.execution()!.ongoingExerciseId === null
    );
  });

  constructor() {
    let restingInterval: number;
    effect(() => {
      const restingStart = this.execution()?.restingStart;
      if (restingStart) {
        restingInterval = window.setInterval(() => {
          const exercise = isExercise(this.ongoingExercise()!)
            ? asExercise(this.ongoingExercise()!)
            : asSuperset(this.ongoingExercise()!).exercises[0];
          const remaining =
            Date.now() - exercise.restingTime * 1000 - restingStart.getTime();
          if (remaining >= 0) {
            clearInterval(restingInterval);
            if (exercise.sets.length - 1 === this.execution()?.setIndex) {
              this.executionService.completeExercise();
            } else {
              this.executionService.nextSet();
            }
          }
        }, 10);
      } else {
        if (restingInterval) clearInterval(restingInterval);
      }
    });
    this.destroyRef.onDestroy(() => {
      if (restingInterval) clearInterval(restingInterval);
    });
  }

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;

  onChooseExercise(exerciseId: number) {
    this.executionService.startExercise(exerciseId);
  }

  onAskLeaveWorkout() {
    this.showAskLeaveWorkout.set(true);
  }

  onLeaveWorkout() {
    this.executionService.abandonWorkout();
  }
}
