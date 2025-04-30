import { AbstractControl } from '@angular/forms';
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

export function getFormattedTime(seconds: number, units = false) {
  const time = getHoursMinutesAndSeconds(seconds);
  if (units) {
    return `${time.hours > 0 ? time.hours + 'h ' : ''}${time.minutes > 0 || (time.hours > 0 && time.seconds > 0) ? time.minutes + 'm ' : ''}${time.seconds > 0 ? time.seconds + 's' : ''}`.trim();
  }
  return `${time.hours}:${time.minutes < 10 ? '0' : ''}${time.minutes}:${time.seconds < 10 ? '0' : ''}${time.seconds}`;
}
