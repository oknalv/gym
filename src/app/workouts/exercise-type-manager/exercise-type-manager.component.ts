import { Component, computed, inject, model, signal } from '@angular/core';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkoutService } from '../../workout.service';
import { ExerciseTypeComponent } from '../exercise-type/exercise-type.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { ExerciseType } from '../../gym.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewExerciseTypeComponent } from '../workout-editor/exercise-editor/exercise-type-editor/new-exercise-type/new-exercise-type.component';

@Component({
  selector: 'gym-exercise-type-manager',
  imports: [
    DialogComponent,
    TranslatePipe,
    ExerciseTypeComponent,
    IconComponent,
    NewExerciseTypeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-type-manager.component.html',
  styleUrl: './exercise-type-manager.component.scss',
})
export class ExerciseTypeManagerComponent {
  open = model.required<boolean>();
  private workoutService = inject(WorkoutService);
  exerciseTypes = computed(() => {
    return this.workoutService
      .exerciseTypes()
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  });
  showExerciseTypeEditor = signal(false);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    image: new FormControl<string | undefined>(undefined),
  });
  editingExerciseTypeId: number | null = null;
  showDeleteExerciseTypeWarning = signal(false);
  deletingExerciseTypeId: number | null = null;

  onEditExerciseType(exerciseType: ExerciseType) {
    this.form.patchValue(exerciseType);
    this.form.markAsPristine();
    this.editingExerciseTypeId = exerciseType.id;
    this.showExerciseTypeEditor.set(true);
  }

  async onSaveExerciseType() {
    if (this.form.valid) {
      await this.workoutService.editExerciseType({
        id: this.editingExerciseTypeId!,
        name: this.form.value.name!,
        image: this.form.value.image!,
      });
      this.showExerciseTypeEditor.set(false);
    }
  }

  onAskDeleteExerciseType(id: number) {
    this.showDeleteExerciseTypeWarning.set(true);
    this.deletingExerciseTypeId = id;
  }

  async onDeleteExerciseType() {
    await this.workoutService.deleteExerciseType(this.deletingExerciseTypeId!);
    this.showDeleteExerciseTypeWarning.set(false);
  }
}
