import { Injectable, signal } from '@angular/core';
import {
  Exercise,
  ExerciseDTO,
  ExerciseType,
  Superset,
  SupersetDTO,
  Workout,
  WorkoutDTO,
} from './gym.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private _exerciseTypes = signal<ExerciseType[]>([]);
  exerciseTypes = this._exerciseTypes.asReadonly();
  private _workouts = signal<Workout[]>([]);
  workouts = this._workouts.asReadonly();
  constructor(private dataService: DataService) {
    this.initWorkouts().then();
  }

  private initExerciseTypes() {
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

  private initWorkouts() {
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
    const newExerciseTypes: Set<ExerciseType> = new Set();
    const newWorkoutDTO: WorkoutDTO = {
      id: workout.id,
      name: workout.name,
      lastExecution: null,
      exercises: workout.exercises.map((exercise) => {
        const type = (exercise as Exercise).type;
        if (type) {
          const _exercise = exercise as Exercise;
          if (!this.exerciseTypes().includes(type)) newExerciseTypes.add(type);
          return { ..._exercise, type: type.id } as ExerciseDTO;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              if (!this.exerciseTypes().includes(supersetExercise.type!))
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

  async editWorkout(workout: Workout) {
    const newExerciseTypes: Set<ExerciseType> = new Set();
    const editWorkoutDTO: WorkoutDTO = {
      id: workout.id,
      name: workout.name,
      lastExecution: null,
      exercises: workout.exercises.map((exercise) => {
        const type = (exercise as Exercise).type;
        if (type) {
          const _exercise = exercise as Exercise;
          if (!this.exerciseTypes().includes(type)) newExerciseTypes.add(type);
          return { ..._exercise, type: type.id } as ExerciseDTO;
        } else {
          const superset = exercise as Superset;
          return {
            ...superset,
            exercises: superset.exercises.map((supersetExercise) => {
              if (!this.exerciseTypes().includes(supersetExercise.type!))
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

  async deleteWorkout(id: number) {
    await this.dataService.deleteData(this.dataService.workoutStoreName, id);
    await this.initWorkouts();
  }
}
