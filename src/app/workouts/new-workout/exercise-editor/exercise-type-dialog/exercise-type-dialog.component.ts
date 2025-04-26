import { Component, input, model, output } from '@angular/core';
import { ExerciseType } from '../../../../exercise.model';
import { ExerciseTypeComponent } from '../../../../exercise-type/exercise-type.component';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';

@Component({
  selector: 'gym-exercise-type-dialog',
  imports: [ExerciseTypeComponent, DialogComponent],
  templateUrl: './exercise-type-dialog.component.html',
  styleUrl: './exercise-type-dialog.component.scss',
})
export class ExerciseTypeDialogComponent {
  open = model.required<boolean>();
  exerciseTypes = input.required<ExerciseType[]>();
  select = output<ExerciseType>();

  onChooseExerciseType(exerciseType: ExerciseType) {
    this.select.emit(exerciseType);
    this.open.set(false);
  }
}
