export interface Exercise {
  id: number;
  type: ExerciseType | null;
  sets: ExerciseSet[];
  weightType: WeightType;
  weighted: boolean;
  progressType: ProgressType;
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
