import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { WorkoutService } from '../../../services/workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ExerciseComponent } from '../../exercise/exercise.component';
import { Exercise } from '../../../gym.model';
import { CloseableWarningComponent } from '../../../shared/closeable-warning/closeable-warning.component';
import { asExercise, isExercise } from '../../../utils';

@Component({
  selector: 'gym-exercise-import-dialog',
  imports: [
    DialogComponent,
    TranslatePipe,
    ExerciseComponent,
    CloseableWarningComponent,
  ],
  templateUrl: './exercise-import-dialog.component.html',
  styleUrl: './exercise-import-dialog.component.scss',
})
export class ExerciseImportDialogComponent {
  IMPORT_EXERCISE_WARNING_KEY = 'gym-import-exercise-warning';
  open = model.required<boolean>();
  existingExerciseIds = input.required<number[]>();
  private workoutService = inject(WorkoutService);
  exercises = computed(() => {
    return this.workoutService
      .workouts()
      .reduce((accumulator, workout) => {
        for (const exercise of workout.exercises) {
          if (
            isExercise(exercise) &&
            !this.existingExerciseIds().includes(exercise.id) &&
            !accumulator.includes(asExercise(exercise))
          ) {
            accumulator.push(asExercise(exercise));
          }
        }
        return accumulator;
      }, [] as Exercise[])
      .sort((a, b) => (a.type!.name < b.type!.name ? -1 : 1));
  });
  import = output<Exercise>();

  onImportExercise(exercise: Exercise) {
    this.import.emit(exercise);
    this.open.set(false);
  }
}
