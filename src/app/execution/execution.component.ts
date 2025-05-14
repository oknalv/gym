import {
  AfterViewInit,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ExecutionService } from '../services/execution.service';
import { WorkoutService } from '../services/workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { asExercise, asSuperset, isExercise } from '../utils';
import { OngoingExerciseComponent } from './ongoing-exercise/ongoing-exercise.component';
import { OngoingSupersetComponent } from './ongoing-superset/ongoing-superset.component';
import { IconComponent } from '../shared/icon/icon.component';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { RouterLink } from '@angular/router';
import { Exercise, Superset } from '../gym.model';
import { ExerciseComponent } from '../workouts/exercise/exercise.component';

@Component({
  selector: 'gym-execution',
  imports: [
    TranslatePipe,
    OngoingExerciseComponent,
    OngoingSupersetComponent,
    IconComponent,
    DialogComponent,
    RouterLink,
    ExerciseComponent,
  ],
  templateUrl: './execution.component.html',
  styleUrl: './execution.component.scss',
})
export class ExecutionComponent implements AfterViewInit {
  readonly TIMER_ID = 'resting-time';
  private executionService = inject(ExecutionService);
  private workoutService = inject(WorkoutService);
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
  doneAndToDoExercises = computed(() => {
    const exercises = {
      done: [] as (Exercise | Superset)[],
      toDo: [] as (Exercise | Superset)[],
    };
    return (
      this.workout()?.exercises.reduce((accumulator, exercise) => {
        if (this.execution()?.completedExerciseIds!.includes(exercise.id))
          accumulator.done.push(exercise);
        else accumulator.toDo.push(exercise);
        return accumulator;
      }, exercises) || exercises
    );
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
        this.execution()!.completedExerciseIds.length ||
      (this.workout()!.exercises.length - 1 ===
        this.execution()!.completedExerciseIds.length &&
        this.exerciseFinished())
    );
  });

  mustChooseExercise = computed(() => {
    if (!this.execution()) return false;
    return (
      !this.workoutFinished() && this.execution()!.ongoingExerciseId === null
    );
  });

  isLastExercise = computed(() => {
    if (!this.execution()) return false;
    return (
      this.workout()!.exercises.length - 1 ===
      this.execution()!.completedExerciseIds.length
    );
  });

  private exerciseFinished() {
    const exercise = this.ongoingExerciseOrFirstSupersetExercise();
    if (!exercise) return false;
    return (
      this.execution()!.restingStart &&
      exercise &&
      Date.now() -
        exercise.restingTime * 1000 -
        this.execution()!.restingStart!.getTime() >=
        0
    );
  }

  private ongoingExerciseOrFirstSupersetExercise = computed(() => {
    if (!this.execution()) return null;
    return this.ongoingExercise()
      ? isExercise(this.ongoingExercise()!)
        ? asExercise(this.ongoingExercise()!)
        : asSuperset(this.ongoingExercise()!).exercises[0]
      : null;
  });

  async ngAfterViewInit() {
    if (this.workoutFinished()) {
      await this.updateWorkoutLastExecution();
      this.onLeaveWorkout();
    }
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

  redoExercise(exerciseId: number) {
    this.executionService.redoExercise(exerciseId);
  }

  protected async updateWorkoutLastExecution() {
    await this.workoutService.editWorkout({
      ...this.workout()!,
      lastExecution: this.execution()!.workoutStart,
    });
  }
}
