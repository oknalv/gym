import { AbstractControl } from '@angular/forms';
import {
  Exercise,
  ExerciseDTO,
  ExerciseSet,
  ProgressType,
  Superset,
  SupersetDTO,
} from './gym.model';
import { WeightUnit } from './services/configuration.service';

export function asExercise(exercise: Exercise | Superset) {
  return exercise as Exercise;
}
export function asExerciseDTO(exercise: ExerciseDTO | SupersetDTO) {
  return exercise as ExerciseDTO;
}

export function asSuperset(exercise: Exercise | Superset) {
  return exercise as Superset;
}

export function asSupersetDTO(exercise: ExerciseDTO | SupersetDTO) {
  return exercise as SupersetDTO;
}

export function isExercise(exercise: Exercise | Superset) {
  return !!(exercise as Exercise).type;
}

export function isExerciseDTO(exercise: ExerciseDTO | SupersetDTO) {
  return !!(exercise as ExerciseDTO).type;
}

export function integerValidator(control: AbstractControl) {
  if (control.value % 1 === 0) return null;
  return { notInteger: true };
}

export function getHoursMinutesAndSeconds(seconds: number) {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

export function getHoursMinutesSecondsAndMilliseconds(milliseconds: number) {
  const hms = getHoursMinutesAndSeconds(Math.floor(milliseconds / 1000));
  return { ...hms, milliseconds: milliseconds % 1000 };
}

export function getFormattedTime(seconds: number) {
  const time = getHoursMinutesAndSeconds(seconds);
  return `${time.hours > 0 ? time.hours + 'h ' : ''}${time.minutes > 0 || (time.hours > 0 && time.seconds > 0) ? time.minutes + 'm ' : ''}${time.seconds > 0 ? time.seconds + 's' : ''}`.trim();
}

export function setToString(
  set: ExerciseSet,
  weighted: boolean,
  progressType: ProgressType,
  weightUnit: WeightUnit,
  failureTranslation: string,
) {
  let setString = weighted ? `${set.weight} ${weightUnit}` : '';
  if (set.failure) {
    if (setString) setString += ' ';
    setString += failureTranslation;
  } else {
    if (setString) setString += ' × ';
    setString +=
      progressType === ProgressType.repetitions
        ? `${set.repetitions} reps`
        : getFormattedTime(set.time);
  }
  return setString;
}
