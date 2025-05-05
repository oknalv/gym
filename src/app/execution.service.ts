import { effect, Injectable, signal } from '@angular/core';
import { Execution, ExecutionDTO } from './gym.model';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  private ONGOING_EXECUTION_STORE_KEY = 'ongoing-execution';
  private _ongoingExecution = signal<Execution | null>(null);
  ongoingExecution = this._ongoingExecution.asReadonly();

  constructor() {
    const execution: ExecutionDTO | null = JSON.parse(
      localStorage.getItem(this.ONGOING_EXECUTION_STORE_KEY) ?? 'null',
    );
    if (execution) {
      this._ongoingExecution.set({
        ...execution,
        restingStart: execution.restingStart
          ? new Date(execution.restingStart)
          : null,
        workoutStart: new Date(execution.workoutStart),
      });
    }
    effect(() => {
      let execution: ExecutionDTO | null = null;
      if (this.ongoingExecution()) {
        execution = {
          ...this.ongoingExecution()!,
          restingStart: null,
          workoutStart: this.ongoingExecution()!.workoutStart.getTime(),
        };
        if (this.ongoingExecution()!.restingStart) {
          execution.restingStart =
            this.ongoingExecution()!.restingStart!.getTime();
        }
      }
      localStorage.setItem(
        this.ONGOING_EXECUTION_STORE_KEY,
        JSON.stringify(execution),
      );
    });
  }

  startWorkout(workoutId: number) {
    if (this.ongoingExecution()) {
      throw 'EXECUTION_ALREADY_STARTED';
    }
    this._ongoingExecution.set({
      workoutId: workoutId,
      completedExerciseIds: [],
      ongoingExerciseId: null,
      restingStart: null,
      setIndex: 0,
      workoutStart: new Date(),
    });
  }

  startExercise(exerciseId: number) {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_ALREADY_STARTED';
    }
    if (this.ongoingExecution()!.completedExerciseIds.includes(exerciseId)) {
      throw 'EXERCISE_ALREADY_DONE';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        setIndex: 0,
        restingStart: null,
        ongoingExerciseId: exerciseId,
      };
    });
  }

  redoExercise(exerciseId: number) {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_ALREADY_STARTED';
    }
    if (!this.ongoingExecution()!.completedExerciseIds.includes(exerciseId)) {
      throw 'EXERCISE_NOT_DONE';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        setIndex: 0,
        restingStart: null,
        ongoingExerciseId: exerciseId,
        completedExerciseIds:
          this._ongoingExecution()!.completedExerciseIds.filter(
            (completedId) => completedId !== exerciseId,
          ),
      };
    });
  }

  abandonExercise() {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (!this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_NOT_STARTED';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        setIndex: 0,
        restingStart: null,
        ongoingExerciseId: null,
      };
    });
  }

  rest() {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (!this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_NOT_STARTED';
    }
    if (this.ongoingExecution()!.restingStart) {
      throw 'ALREADY_RESTING';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        restingStart: new Date(),
      };
    });
  }

  nextSet() {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (!this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_NOT_STARTED';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        restingStart: null,
        setIndex: execution!.setIndex + 1,
      };
    });
  }

  completeExercise() {
    if (!this.ongoingExecution()) {
      throw 'EXECUTION_NOT_STARTED';
    }
    if (!this.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_NOT_STARTED';
    }
    this._ongoingExecution.update((execution) => {
      return {
        ...execution!,
        restingStart: null,
        setIndex: 0,
        completedExerciseIds: [
          ...execution!.completedExerciseIds,
          execution!.ongoingExerciseId!,
        ],
        ongoingExerciseId: null,
      };
    });
  }

  abandonWorkout() {
    this._ongoingExecution.set(null);
  }
}
