import { Injectable, signal } from '@angular/core';
import { ExerciseType } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private _exerciseTypes = signal<ExerciseType[]>([]);
  exerciseTypes = this._exerciseTypes.asReadonly();
  constructor() {}
}
