import { Component, effect, input, model, output, signal } from '@angular/core';
import { Exercise, ExerciseType, Superset } from '../../../exercise.model';
import { ExerciseEditorComponent } from '../exercise-editor/exercise-editor.component';
import { ExerciseComponent } from '../../../exercise/exercise.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { DeleteWarningDialogComponent } from '../../../shared/dialog/delete-warning-dialog/delete-warning-dialog.component';

@Component({
  selector: 'gym-superset-editor',
  imports: [
    ExerciseEditorComponent,
    ExerciseComponent,
    IconComponent,
    DeleteWarningDialogComponent,
  ],
  templateUrl: './superset-editor.component.html',
  styleUrl: './superset-editor.component.scss',
})
export class SupersetEditorComponent {
  baseSuperset = input.required<Superset>();
  superset = output<Superset>();
  exerciseTypes = input.required<ExerciseType[]>();
  exerciseEditorVisible = signal(false);
  editingExercise = signal<Exercise | undefined>(undefined);
  newExerciseType = output<ExerciseType>();
  private exerciseToDelete!: number;
  showAskDeleteExercise = signal(false);
  numberOfSets = signal(1);

  get exercises() {
    return this.baseSuperset().exercises;
  }

  constructor() {
    effect(() => {
      if (!this.exerciseEditorVisible()) {
        this.editingExercise.set(undefined);
      }
    });
  }

  showExerciseEditor() {
    this.exerciseEditorVisible.set(true);
  }

  onGetExercise(receivedExercise: Exercise) {
    const existingExercise = this.exercises.find(
      (exercise) => receivedExercise.id === exercise.id,
    );
    if (existingExercise) {
      this.exercises.splice(
        this.exercises.indexOf(existingExercise),
        1,
        receivedExercise,
      );
    } else this.exercises.push(receivedExercise);
    this.exerciseEditorVisible.set(false);
    if (
      !this.exerciseTypes().find(
        (exerciseType) => exerciseType.id === receivedExercise.type!.id,
      )
    ) {
      this.newExerciseType.emit(receivedExercise.type!);
    }
    for (const exercise of this.baseSuperset().exercises) {
      if (exercise.sets.length !== receivedExercise.sets.length) {
        this.changeExerciseSets(exercise, receivedExercise.sets.length);
      }
    }
    this.numberOfSets.set(receivedExercise.sets.length);
    this.superset.emit(this.baseSuperset());
  }

  changeExerciseSets(exercise: Exercise, numberOfSets: number) {
    while (exercise.sets.length < numberOfSets) {
      exercise.sets.push(exercise.sets.at(-1)!);
    }
    while (exercise.sets.length > numberOfSets) {
      exercise.sets.pop();
    }
  }

  onEditExercise(exercise: Exercise) {
    this.editingExercise.set(exercise);
    this.exerciseEditorVisible.set(true);
  }

  onAskDeleteExercise(index: number) {
    this.showAskDeleteExercise.set(true);
    this.exerciseToDelete = index;
  }

  onDeleteExercise() {
    this.exercises.splice(this.exerciseToDelete, 1);
    this.showAskDeleteExercise.set(false);
    this.superset.emit(this.baseSuperset());
  }
}
