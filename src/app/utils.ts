import { Exercise, Superset } from './gym.model';

export function asExercise(exercise: Exercise | Superset) {
  return exercise as Exercise;
}

export function asSuperset(exercise: Exercise | Superset) {
  return exercise as Superset;
}

export function isExercise(exercise: Exercise | Superset) {
  return !!(exercise as Exercise).type;
}
