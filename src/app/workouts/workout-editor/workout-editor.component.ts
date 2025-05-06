import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ExerciseEditorComponent } from './exercise-editor/exercise-editor.component';
import { TextInputComponent } from '../../shared/text-input/text-input.component';
import { Exercise, ExerciseType, Superset } from '../../gym.model';
import { WorkoutService } from '../../workout.service';
import { ExerciseComponent } from '../exercise/exercise.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { SupersetEditorComponent } from './superset-editor/superset-editor.component';
import { DeleteWarningDialogComponent } from '../../shared/dialog/delete-warning-dialog/delete-warning-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { asExercise, asSuperset, isExercise } from '../../utils';
import { BackLinkComponent } from '../../shared/back-link/back-link.component';

@Component({
  selector: 'gym-workout-editor',
  imports: [
    ReactiveFormsModule,
    ExerciseEditorComponent,
    TextInputComponent,
    ExerciseComponent,
    IconComponent,
    SupersetEditorComponent,
    DeleteWarningDialogComponent,
    TranslatePipe,
    BackLinkComponent,
  ],
  templateUrl: './workout-editor.component.html',
  styleUrl: './workout-editor.component.scss',
})
export class WorkoutEditorComponent {
  id = input<string>();
  editMode = computed(() => {
    return !!this.id();
  });
  titleKey = computed(() => {
    return `workouts.editor.${this.editMode() ? 'edit' : 'new'}`;
  });
  submitKey = computed(() => {
    return `workouts.editor.${this.editMode() ? 'save' : 'add'}`;
  });
  backLinkKey = computed(() => {
    return `workouts.backLinks.${this.editMode() ? 'workout' : 'workouts'}`;
  });

  private workoutService = inject(WorkoutService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private newExerciseTypes: WritableSignal<ExerciseType[]> = signal([]);
  exerciseTypes = computed(() => [
    ...this.workoutService.exerciseTypes(),
    ...this.newExerciseTypes(),
  ]);
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  exerciseEditorVisible = signal(false);
  showAskDeleteExercise = signal(false);
  deleteSuperset = signal(false);
  private exerciseToDelete!: number;
  editingExercise = signal<Exercise | undefined>(undefined);
  firstSubmitClick = signal(false);

  exercises: (Exercise | Superset)[] = [];

  private lastExecution: Date | null = null;

  constructor() {
    effect(() => {
      if (this.id()) {
        const workout = this.workoutService
          .workouts()
          .find((workout) => workout.id === +this.id()!);
        if (workout) {
          this.form.controls.name.setValue(workout.name);
          this.exercises = [...workout.exercises];
          this.lastExecution = workout.lastExecution;
        } else {
          this.router.navigate(['..']);
        }
      }
    });
    effect(() => {
      if (!this.exerciseEditorVisible()) {
        this.editingExercise.set(undefined);
      }
    });
  }

  get showExerciseListError() {
    return this.firstSubmitClick() && this.exercises.length === 0;
  }

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;

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
      this.onGetNewExerciseType(receivedExercise.type!);
    }
  }

  onGetSuperset(receivedSuperset: Superset, index: number) {
    this.exercises.splice(index, 1, receivedSuperset);
  }

  onDeleteExercise() {
    this.exercises.splice(this.exerciseToDelete, 1);
    this.showAskDeleteExercise.set(false);
  }

  onAskDeleteExercise(index: number) {
    this.showAskDeleteExercise.set(true);
    this.deleteSuperset.set(false);
    this.exerciseToDelete = index;
  }

  onAskDeleteSuperset(index: number) {
    this.showAskDeleteExercise.set(true);
    this.deleteSuperset.set(true);
    this.exerciseToDelete = index;
  }

  onEditExercise(exercise: Exercise) {
    this.editingExercise.set(exercise);
    this.exerciseEditorVisible.set(true);
  }
  onGetNewExerciseType(type: ExerciseType) {
    this.newExerciseTypes.update((exerciseTypes) => [...exerciseTypes, type]);
  }

  addSuperset() {
    this.exercises.push({
      id: Date.now(),
      exercises: [],
    });
  }

  private emptySupersets() {
    for (const superset of this.exercises) {
      if (
        (superset as Superset).exercises !== undefined &&
        (superset as Superset).exercises.length === 0
      ) {
        return true;
      }
    }
    return false;
  }

  async onSubmitWorkout(event: Event) {
    event.preventDefault();
    this.firstSubmitClick.set(true);
    this.form.controls.name.markAsDirty();
    if (
      this.form.valid &&
      !this.showExerciseListError &&
      !this.emptySupersets()
    ) {
      if (this.editMode()) {
        await this.workoutService.editWorkout({
          id: +this.id()!,
          name: this.form.value.name!,
          exercises: this.exercises,
          lastExecution: this.lastExecution,
        });
      } else {
        await this.workoutService.addWorkout({
          id: Date.now(),
          name: this.form.value.name!,
          exercises: this.exercises,
          lastExecution: null,
        });
      }
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}
