import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  PristineChangeEvent,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExerciseType } from '../../../../exercise.model';
import { ExerciseTypeDialogComponent } from './exercise-type-dialog/exercise-type-dialog.component';
import { NewExerciseTypeComponent } from './new-exercise-type/new-exercise-type.component';
import { ExerciseTypeComponent } from '../../../../exercise-type/exercise-type.component';

@Component({
  selector: 'gym-exercise-type-editor',
  imports: [
    ExerciseTypeDialogComponent,
    NewExerciseTypeComponent,
    ExerciseTypeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-type-editor.component.html',
  styleUrl: './exercise-type-editor.component.scss',
})
export class ExerciseTypeEditorComponent {
  private controlContainer = inject(ControlContainer);
  form!: FormGroup;
  exerciseTypes = input.required<ExerciseType[]>();
  showExerciseTypeDialog = signal(false);
  showNewExerciseTypeForm = signal(false);
  showError = input.required<boolean>();
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    const pristineSubscription = this.form.events.subscribe({
      next: (event) => {
        if (event instanceof PristineChangeEvent && event.pristine) {
          this.showNewExerciseTypeForm.set(false);
        }
      },
    });

    const exerciseTypeSubscription = this.form.controls[
      'exerciseType'
    ].valueChanges.subscribe({
      next: (newValue) => {
        if (newValue) this.showNewExerciseTypeForm.set(false);
      },
    });
    this.destroyRef.onDestroy(() => {
      pristineSubscription.unsubscribe();
      exerciseTypeSubscription.unsubscribe();
    });
  }

  get exerciseType() {
    return this.form.value.exerciseType;
  }

  onSelectExerciseType(exerciseType: ExerciseType) {
    this.form.controls['exerciseType'].setValue(exerciseType);
    this.form.controls['exerciseType'].updateValueAndValidity();
  }

  onOpenExerciseTypeDialog() {
    this.showExerciseTypeDialog.set(true);
  }

  onShowNewExerciseTypeForm() {
    this.form.patchValue({ exerciseType: null });
    this.showNewExerciseTypeForm.set(true);
  }
}
