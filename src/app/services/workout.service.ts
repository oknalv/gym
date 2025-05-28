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
import { DataService, DBAction } from './data.service';
import { ExecutionService } from './execution.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _exerciseTypes = signal<ExerciseType[]>([]);
  exerciseTypes = this._exerciseTypes.asReadonly();
  private _exercises = signal<Exercise[]>([]);
  exercises = this._exercises.asReadonly();
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

  private async initExercises() {
    return new Promise<void>(async (resolve, reject) => {
      await this.initExerciseTypes();
      this.dataService
        .getAllData(this.dataService.exerciseStoreName)
        .then((exerciseDTOs: ExerciseDTO[]) => {
          this._exercises.set(
            exerciseDTOs.map((exerciseDTO) => {
              return {
                ...exerciseDTO,
                type: this.exerciseTypes().find(
                  (exerciseType) => exerciseType.id === exerciseDTO.type,
                )!,
              };
            }),
          );
          resolve();
        })
        .catch(reject);
    });
  }

  private async initWorkouts() {
    return new Promise<void>(async (resolve, reject) => {
      await this.initExercises();
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
              exercises: workoutDTO.exercises.map((obj) => {
                if (typeof obj === 'number') {
                  return this.exercises().find(
                    (exercise) => exercise.id === obj,
                  );
                } else {
                  const supersetDto = obj as SupersetDTO;
                  return {
                    ...supersetDto,
                    exercises: supersetDto.exercises.map((exerciseId) => {
                      return this.exercises().find(
                        (exercise) => exercise.id === exerciseId,
                      );
                    }),
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
    const newExerciseTypes: ExerciseType[] = [];
    const newExerciseDTOs: ExerciseDTO[] = [];
    const existingExerciseDTOs: ExerciseDTO[] = [];
    const newWorkoutDTO: WorkoutDTO = {
      id: workout.id,
      name: workout.name,
      lastExecution: null,
      exercises: workout.exercises.map((exercise) => {
        const type = (exercise as Exercise).type;
        if (type) {
          const _exercise = exercise as Exercise;
          this.checkAddEditExercise(
            _exercise,
            newExerciseDTOs,
            existingExerciseDTOs,
            newExerciseTypes,
          );
          return _exercise.id;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              this.checkAddEditExercise(
                supersetExercise,
                newExerciseDTOs,
                existingExerciseDTOs,
                newExerciseTypes,
              );
              return supersetExercise.id;
            }),
          } as SupersetDTO;
        }
      }),
    };
    const dbActions: DBAction[] = [
      ...newExerciseTypes.map((newExerciseType) => {
        return {
          name: 'add',
          storeName: this.dataService.exerciseTypeStoreName,
          data: newExerciseType,
        } as DBAction;
      }),
      ...newExerciseDTOs.map((newExerciseDTO) => {
        return {
          name: 'add',
          storeName: this.dataService.exerciseStoreName,
          data: newExerciseDTO,
        } as DBAction;
      }),
      ...existingExerciseDTOs.map((existingExercise) => {
        return {
          name: 'update',
          storeName: this.dataService.exerciseStoreName,
          data: existingExercise,
        } as DBAction;
      }),
      {
        name: 'add',
        storeName: this.dataService.workoutStoreName,
        data: newWorkoutDTO,
      },
    ];
    await this.dataService.batchExecute(dbActions);
    await this.initWorkouts();
  }

  async editWorkout(workout: Workout) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    const oldWorkoutDTO = (await this.dataService.getData(
      this.dataService.workoutStoreName,
      workout.id,
    )) as WorkoutDTO;
    if (!oldWorkoutDTO) {
      throw 'WORKOUT_NOT_FOUND';
    }
    const newExerciseTypes: ExerciseType[] = [];
    const newExerciseDTOs: ExerciseDTO[] = [];
    const existingExerciseDTOs: ExerciseDTO[] = [];
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
          this.checkAddEditExercise(
            _exercise,
            newExerciseDTOs,
            existingExerciseDTOs,
            newExerciseTypes,
          );
          return _exercise.id;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              this.checkAddEditExercise(
                supersetExercise,
                newExerciseDTOs,
                existingExerciseDTOs,
                newExerciseTypes,
              );
              return supersetExercise.id;
            }),
          } as SupersetDTO;
        }
      }),
    };
    const exerciseIdsNotToDelete = [
      ...(await this.getExerciseIdsFromOtherWorkouts(oldWorkoutDTO.id)),
      ...existingExerciseDTOs.map((exerciseDTO) => exerciseDTO.id),
    ];
    const exerciseIdsToDelete = this.getWorkoutExerciseIds(
      oldWorkoutDTO,
    ).filter((exerciseId) => !exerciseIdsNotToDelete.includes(exerciseId));

    const dbActions: DBAction[] = [
      ...newExerciseTypes.map((newExerciseType) => {
        return {
          name: 'add',
          storeName: this.dataService.exerciseTypeStoreName,
          data: newExerciseType,
        } as DBAction;
      }),
      ...newExerciseDTOs.map((newExerciseDTO) => {
        return {
          name: 'add',
          storeName: this.dataService.exerciseStoreName,
          data: newExerciseDTO,
        } as DBAction;
      }),
      ...existingExerciseDTOs.map((existingExercise) => {
        return {
          name: 'update',
          storeName: this.dataService.exerciseStoreName,
          data: existingExercise,
        } as DBAction;
      }),
      ...exerciseIdsToDelete.map((exerciseId) => {
        return {
          name: 'delete',
          storeName: this.dataService.exerciseStoreName,
          data: exerciseId,
        } as DBAction;
      }),
      {
        name: 'update',
        storeName: this.dataService.workoutStoreName,
        data: editWorkoutDTO,
      },
    ];
    await this.dataService.batchExecute(dbActions);
    await this.initWorkouts();
  }

  private getWorkoutExerciseIds(workoutDTO: WorkoutDTO) {
    return workoutDTO.exercises
      .map((exercise) => {
        if (typeof exercise === 'number') return exercise;
        return exercise.exercises;
      })
      .flat();
  }

  private async getExerciseIdsFromOtherWorkouts(
    idFromWorkoutToExclude: number,
  ) {
    return (
      await this.dataService.getAllData(this.dataService.workoutStoreName)
    )
      .filter((workoutDTO) => workoutDTO.id != idFromWorkoutToExclude)
      .map(this.getWorkoutExerciseIds)
      .flat();
  }

  private checkAddEditExercise(
    exercise: Exercise,
    newExerciseDTOs: ExerciseDTO[],
    existingExerciseDTOs: ExerciseDTO[],
    newExerciseTypes: ExerciseType[],
  ) {
    if (
      newExerciseDTOs.find((exerciseDTO) => exercise.id === exerciseDTO.id) ||
      existingExerciseDTOs.find((exerciseDTO) => exercise.id === exerciseDTO.id)
    ) {
      throw 'DUPLICATED_EXERCISE';
    }
    if (!this.exercises().find((_exercise) => exercise.id === _exercise.id)) {
      newExerciseDTOs.push({
        ...exercise,
        type: exercise.type!.id,
      });
    } else {
      existingExerciseDTOs.push({
        ...exercise,
        type: exercise.type!.id,
      });
    }
    if (
      !this.exerciseTypes().find(
        (exerciseType) => exerciseType.id === exercise.type!.id,
      ) &&
      !newExerciseTypes.find(
        (exerciseType) => exerciseType.id === exercise.type!.id,
      )
    )
      newExerciseTypes.push(exercise.type!);
  }

  async deleteWorkout(id: number) {
    if (this.executionService.ongoingExecution()) {
      throw 'WORKOUT_EXECUTING';
    }
    const exerciseIdsNotToDelete =
      await this.getExerciseIdsFromOtherWorkouts(id);
    const exerciseIdsToDelete = this.getWorkoutExerciseIds(
      await this.dataService.getData(this.dataService.workoutStoreName, id),
    ).filter((exerciseId) => !exerciseIdsNotToDelete.includes(exerciseId));
    await this.dataService.batchExecute([
      ...exerciseIdsToDelete.map((exerciseId) => {
        return {
          name: 'delete',
          storeName: this.dataService.exerciseStoreName,
          data: exerciseId,
        } as DBAction;
      }),
      {
        name: 'delete',
        storeName: this.dataService.workoutStoreName,
        data: id,
      },
    ]);
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
    const idsFromExercisesToDelete = (
      await this.dataService.getAllData(this.dataService.exerciseStoreName)
    )
      .filter((exercise) => exercise.type === id)
      .map((exercise) => exercise.id);
    const workouts: { toDelete: WorkoutDTO[]; toUpdate: WorkoutDTO[] } = (
      await this.dataService.getAllData(this.dataService.workoutStoreName)
    ).reduce(
      (accumulator, workout: WorkoutDTO) => {
        let touched = false;
        for (let i = workout.exercises.length - 1; i >= 0; i--) {
          const exercise = workout.exercises[i];
          if (typeof exercise === 'number') {
            if (idsFromExercisesToDelete.includes(exercise)) {
              workout.exercises.splice(i, 1);
              touched = true;
            }
          } else {
            for (let j = exercise.exercises.length - 1; j >= 0; j--) {
              const supersetExerciseId = exercise.exercises[j];
              if (idsFromExercisesToDelete.includes(supersetExerciseId)) {
                exercise.exercises.splice(j, 1);
                touched = true;
              }
            }
            if (exercise.exercises.length === 0) {
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
    const dbActions: DBAction[] = [
      ...idsFromExercisesToDelete.map((exerciseId) => {
        return {
          name: 'delete',
          storeName: this.dataService.exerciseStoreName,
          data: exerciseId,
        } as DBAction;
      }),
      ...workouts.toDelete.map((workout) => {
        return {
          name: 'delete',
          storeName: this.dataService.workoutStoreName,
          data: workout.id,
        } as DBAction;
      }),
      ...workouts.toUpdate.map((workout) => {
        return {
          name: 'update',
          storeName: this.dataService.workoutStoreName,
          data: workout,
        } as DBAction;
      }),
      {
        name: 'delete',
        storeName: this.dataService.exerciseTypeStoreName,
        data: id,
      },
    ];
    await this.dataService.batchExecute(dbActions);
    await this.initWorkouts();
  }

  async changeRemarkOfExercise(exerciseId: number, remark: Remark | null) {
    const exerciseDTO: ExerciseDTO = await this.dataService.getData(
      this.dataService.exerciseStoreName,
      exerciseId,
    );
    if (!exerciseDTO) {
      throw 'EXERCISE_NOT_FOUND';
    }
    exerciseDTO.remark = remark;
    await this.dataService.updateData(
      this.dataService.exerciseStoreName,
      exerciseDTO,
    );
    await this.initWorkouts();
  }
}
