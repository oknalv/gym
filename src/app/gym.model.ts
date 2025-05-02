export interface Execution {
  workoutId: number;
  completedExerciseIds: number[];
  ongoingExerciseId: number | null;
  restingStart: Date | null;
  setIndex: number;
}

export interface Workout {
  id: number;
  name: string;
  lastExecution: Date | null;
  exercises: (Exercise | Superset)[];
}

export interface Exercise {
  id: number;
  type: ExerciseType | null;
  sets: ExerciseSet[];
  weightType: WeightType;
  weighted: boolean;
  progressType: ProgressType;
  restingTime: number;
}

export interface Superset {
  id: number;
  exercises: Exercise[];
}

export interface ExerciseType {
  id: number;
  name: string;
  image?: string;
}

export interface ExerciseSet {
  repetitions: number;
  time: number;
  weight: number;
}

export enum WeightType {
  total = 'total',
  side = 'side',
}

export enum ProgressType {
  repetitions = 'repetitions',
  time = 'time',
}

export interface ExecutionDTO {
  workoutId: number;
  completedExerciseIds: number[];
  ongoingExerciseId: number | null;
  restingStart: number | null;
  setIndex: number;
}

export interface WorkoutDTO {
  id: number;
  name: string;
  lastExecution: number | null;
  exercises: (ExerciseDTO | SupersetDTO)[];
}

export interface ExerciseDTO {
  id: number;
  type: number;
  sets: ExerciseSet[];
  weightType: WeightType;
  weighted: boolean;
  progressType: ProgressType;
  restingTime: number;
}

export interface SupersetDTO {
  id: number;
  exercises: ExerciseDTO[];
}
