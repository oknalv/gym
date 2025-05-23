import { inject, Injectable, signal } from '@angular/core';
import {
  Exercise,
  ExerciseDTO,
  ExerciseType,
  Remark,
  Superset,
  SupersetDTO,
  Workout,
  WorkoutDTO,
} from '../gym.model';
import { DataService } from './data.service';
import { ExecutionService } from './execution.service';
import {
  asExercise,
  asExerciseDTO,
  asSuperset,
  asSupersetDTO,
  isExercise,
  isExerciseDTO,
} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _exerciseTypes = signal<ExerciseType[]>([]);
  exerciseTypes = this._exerciseTypes.asReadonly();
  private _workouts = signal<Workout[]>([]);
  workouts = this._workouts.asReadonly();
  private executionService = inject(ExecutionService);
  private dataService = inject(DataService);

  constructor() {}

  async init() {
    return this.initWorkouts();
  }

  private async initExerciseTypes() {
    return new Promise<void>((resolve, reject) => {
      this.dataService
        .getAllData(this.dataService.exerciseTypeStoreName)
        .then((exerciseTypes: ExerciseType[]) => {
          this._exerciseTypes.set(exerciseTypes);
          resolve();
        })
        .catch(reject);
    });
  }

  private async initWorkouts() {
    return new Promise<void>(async (resolve, reject) => {
      await this.initExerciseTypes();
      this.dataService
        .getAllData(this.dataService.workoutStoreName)
        .then((workoutDTOs: WorkoutDTO[]) => {
          const workouts = workoutDTOs.map((workoutDTO) => {
            return {
              id: workoutDTO.id,
              name: workoutDTO.name,
              lastExecution: workoutDTO.lastExecution
                ? new Date(workoutDTO.lastExecution)
                : null,
              exercises: workoutDTO.exercises.map((dto) => {
                const type = (dto as ExerciseDTO).type;
                if (type) {
                  const exerciseDTO = dto as ExerciseDTO;
                  return {
                    ...exerciseDTO,
                    type: this.exerciseTypes().find(
                      (exerciseType) => exerciseType.id === exerciseDTO.type,
                    ),
                  } as Exercise;
                } else {
                  const supersetDto = dto as SupersetDTO;
                  return {
                    ...supersetDto,
                    exercises: supersetDto.exercises.map(
                      (supersetExerciseDTO) => {
                        return {
                          ...supersetExerciseDTO,
                          type: this.exerciseTypes().find(
                            (exerciseType) =>
                              exerciseType.id === supersetExerciseDTO.type,
                          ),
                        };
                      },
                    ),
                  } as Superset;
                }
              }),
            } as Workout;
          });
          this._workouts.set(workouts);
          resolve();
        })
        .catch(reject);
    });
  }

  async addWorkout(workout: Workout) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    const newExerciseTypes: Set<ExerciseType> = new Set();
    const newWorkoutDTO: WorkoutDTO = {
      id: workout.id,
      name: workout.name,
      lastExecution: null,
      exercises: workout.exercises.map((exercise) => {
        const type = (exercise as Exercise).type;
        if (type) {
          const _exercise = exercise as Exercise;
          if (
            !this.exerciseTypes()
              .map((type) => type.id)
              .includes(type.id)
          )
            newExerciseTypes.add(type);
          return { ..._exercise, type: type.id } as ExerciseDTO;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              if (
                !this.exerciseTypes()
                  .map((type) => type.id)
                  .includes(supersetExercise.type!.id)
              )
                newExerciseTypes.add(supersetExercise.type!);
              return {
                ...supersetExercise,
                type: supersetExercise.type!.id,
              } as ExerciseDTO;
            }),
          } as SupersetDTO;
        }
      }),
    };
    for (const newExerciseType of newExerciseTypes) {
      await this.dataService.addData(
        this.dataService.exerciseTypeStoreName,
        newExerciseType,
      );
    }
    await this.dataService.addData(
      this.dataService.workoutStoreName,
      newWorkoutDTO,
    );
    await this.initWorkouts();
  }

  private async _editWorkout(workout: Workout) {
    const newExerciseTypes: Set<ExerciseType> = new Set();
    const editWorkoutDTO: WorkoutDTO = {
      id: workout.id,
      name: workout.name,
      lastExecution: workout.lastExecution
        ? workout.lastExecution.getTime()
        : null,
      exercises: workout.exercises.map((exercise) => {
        const type = (exercise as Exercise).type;
        if (type) {
          const _exercise = exercise as Exercise;
          if (
            !this.exerciseTypes()
              .map((type) => type.id)
              .includes(type.id)
          )
            newExerciseTypes.add(type);
          return { ..._exercise, type: type.id } as ExerciseDTO;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              if (
                !this.exerciseTypes()
                  .map((type) => type.id)
                  .includes(supersetExercise.type!.id)
              )
                newExerciseTypes.add(supersetExercise.type!);
              return {
                ...supersetExercise,
                type: supersetExercise.type!.id,
              } as ExerciseDTO;
            }),
          } as SupersetDTO;
        }
      }),
    };
    for (const newExerciseType of newExerciseTypes) {
      await this.dataService.addData(
        this.dataService.exerciseTypeStoreName,
        newExerciseType,
      );
    }
    await this.dataService.updateData(
      this.dataService.workoutStoreName,
      editWorkoutDTO,
    );
    await this.initWorkouts();
  }

  async editWorkout(workout: Workout) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    await this._editWorkout(workout);
  }

  async deleteWorkout(id: number) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    await this.dataService.deleteData(this.dataService.workoutStoreName, id);
    await this.initWorkouts();
  }

  async editExerciseType(exerciseType: ExerciseType) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    await this.dataService.updateData(
      this.dataService.exerciseTypeStoreName,
      exerciseType,
    );
    await this.initWorkouts();
  }

  async deleteExerciseType(id: number) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    const workouts = (
      await this.dataService.getAllData(this.dataService.workoutStoreName)
    ).reduce(
      (accumulator, workout: WorkoutDTO) => {
        let touched = false;
        for (let i = workout.exercises.length - 1; i >= 0; i--) {
          const exercise = workout.exercises[i];
          if (isExerciseDTO(exercise)) {
            if (asExerciseDTO(exercise).type === id) {
              workout.exercises.splice(i, 1);
              touched = true;
            }
          } else {
            const superset = asSupersetDTO(exercise);
            for (
              let j = asSupersetDTO(exercise).exercises.length - 1;
              j >= 0;
              j--
            ) {
              const supersetExercise = superset.exercises[j];
              if (supersetExercise.type === id) {
                superset.exercises.splice(j, 1);
                touched = true;
              }
            }
            if (superset.exercises.length === 0) {
              workout.exercises.splice(i, 1);
              touched = true;
            }
          }
        }
        if (touched) {
          if (workout.exercises.length === 0) {
            accumulator.toDelete.push(workout);
          } else {
            accumulator.toUpdate.push(workout);
          }
        }
        return accumulator;
      },
      {
        toUpdate: [],
        toDelete: [],
      } as { toUpdate: WorkoutDTO[]; toDelete: WorkoutDTO[] },
    );
    for (const workout of workouts.toDelete) {
      await this.dataService.deleteData(
        this.dataService.workoutStoreName,
        workout.id,
      );
    }
    for (const workout of workouts.toUpdate) {
      await this.dataService.updateData(
        this.dataService.workoutStoreName,
        workout,
      );
    }
    await this.dataService.deleteData(
      this.dataService.exerciseTypeStoreName,
      id,
    );
    await this.initWorkouts();
  }

  async changeRemarkOfOngoingWorkoutExercise(
    exerciseId: number,
    remark: Remark | null,
  ) {
    if (!this.executionService.ongoingExecution()) {
      throw 'WORKOUT_NOT_EXECUTING';
    }
    if (!this.executionService.ongoingExecution()!.ongoingExerciseId) {
      throw 'EXERCISE_NOT_EXECUTING';
    }
    const workout = this._workouts().find(
      (workout) =>
        workout.id === this.executionService.ongoingExecution()!.workoutId,
    );
    if (!workout) {
      throw 'WORKOUT_NOT_FOUND';
    }
    if (
      this.executionService.ongoingExecution()!.ongoingExerciseId === exerciseId
    ) {
      let exercise = workout.exercises.find(
        (exercise) => exercise.id === exerciseId,
      );
      if (!exercise) {
        throw 'EXERCISE_NOT_FOUND';
      }
      if (!isExercise(exercise)) {
        throw 'SUPERSET_INSTEAD_OF_EXERCISE';
      }
      exercise = asExercise(exercise);
      exercise.remark = remark;
    } else {
      const superset = workout.exercises.find(
        (exercise) =>
          exercise.id ===
          this.executionService.ongoingExecution()!.ongoingExerciseId,
      );
      if (!superset) {
        throw 'SUPERSET_NOT_FOUND';
      }
      if (isExercise(superset)) {
        throw 'EXERCISE_INSTEAD_OF_SUPERSET';
      }
      const exercise = asSuperset(superset).exercises.find(
        (exercise) => exercise.id === exerciseId,
      );
      if (!exercise) {
        throw 'EXERCISE_NOT_FOUND_IN_SUPERSET';
      }
      exercise.remark = remark;
    }
    await this._editWorkout(workout);
  }
}
