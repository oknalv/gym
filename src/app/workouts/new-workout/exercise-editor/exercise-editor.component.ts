import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { NewExerciseTypeComponent } from './new-exercise-type/new-exercise-type.component';
import {
  ExerciseType,
  WeightType,
  ProgressType,
  Exercise,
} from '../../../exercise.model';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  getNewFormGroupForSet,
  getRepetitionsValidators,
  getTimeValidators,
  getWeightValidators,
  SetsEditorComponent,
} from '../../../sets-editor/sets-editor.component';
import { SwitchComponent } from '../../../shared/switch/switch.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ExerciseTypeComponent } from '../../../exercise-type/exercise-type.component';
import { ExerciseTypeDialogComponent } from './exercise-type-dialog/exercise-type-dialog.component';
import { DialogComponent } from '../../../shared/dialog/dialog.component';

@Component({
  selector: 'gym-exercise-editor',
  imports: [
    NewExerciseTypeComponent,
    FormsModule,
    SetsEditorComponent,
    SwitchComponent,
    IconComponent,
    ReactiveFormsModule,
    ExerciseTypeComponent,
    ExerciseTypeDialogComponent,
    DialogComponent,
  ],
  templateUrl: './exercise-editor.component.html',
  styleUrl: './exercise-editor.component.scss',
})
export class ExerciseEditorComponent {
  //main input and output
  baseExercise = input.required<Exercise | undefined>();
  exercise = output<Exercise>();

  //other inputs
  exerciseTypes = input.required<ExerciseType[]>();
  numberOfSets = input<number>(1);
  inSuperset = input(false);

  //template conditional flags
  open = model.required<boolean>();
  editMode = computed(() => {
    return !!this.baseExercise();
  });
  private hideSupersetSetsWarning = signal(
    localStorage.getItem('hide-superset-sets-warning') === 'true',
  );
  showSupersetSetsWarning = computed(() => {
    return this.inSuperset() && !this.hideSupersetSetsWarning();
  });
  showExerciseTypeDialog = signal(false);
  showNewExerciseTypeForm = signal(false);

  //dependencies
  private destroyRef = inject(DestroyRef);

  private exerciseId!: number;
  private firstCreateClick = false;
  private dirty = false;

  form = new FormGroup({
    exerciseType: new FormControl<ExerciseType | null>(null),
    newExerciseType: new FormGroup({
      name: new FormControl('', [Validators.required]),
      image: new FormControl<string | undefined>(undefined),
    }),
    weighted: new FormControl(true),
    weightType: new FormControl(WeightType.total),
    progressType: new FormControl(ProgressType.repetitions),
    sets: new FormGroup({
      sets: new FormArray<
        FormGroup<{
          id: FormControl<number | null>;
          weight: FormControl<number | null>;
          repetitions: FormControl<number | null>;
          time: FormControl<number | null>;
        }>
      >([]),
    }),
  });

  constructor() {
    //for storing hide-superset-sets-warning flag in localStorage
    effect(() => {
      localStorage.setItem(
        'hide-superset-sets-warning',
        JSON.stringify(this.hideSupersetSetsWarning()),
      );
    });
    //for filling the form with either the provided exercise or with a new one
    effect(() => {
      if (this.baseExercise()) this.fillForm(this.baseExercise()!);
      else this.resetForm();
    });

    //for updating some controls' validators depending on other controls' values
    //this updates the weight controls validators depending on weighted flag
    const weightedSubscription = this.form.controls[
      'weighted'
    ].valueChanges.subscribe({
      next: (newValue) => {
        for (const set of (
          (this.form.controls['sets'] as FormGroup).controls[
            'sets'
          ] as FormArray<FormGroup>
        ).controls) {
          set.controls['weight'].setValidators(getWeightValidators(newValue!));
          set.controls['weight'].updateValueAndValidity();
        }
      },
    });
    //this updates time and repetitions controls validators depending on progressType flag
    const progressTypeSubscription = this.form.controls[
      'progressType'
    ].valueChanges.subscribe({
      next: (newValue) => {
        for (const set of (
          (this.form.controls['sets'] as FormGroup).controls[
            'sets'
          ] as FormArray<FormGroup>
        ).controls) {
          set.controls['time'].setValidators(getTimeValidators(newValue!));
          set.controls['time'].updateValueAndValidity();
          set.controls['repetitions'].setValidators(
            getRepetitionsValidators(newValue!),
          );
          set.controls['repetitions'].updateValueAndValidity();
        }
      },
    });
    //this updates name control depending on having the exerciseType field filled or not
    const exerciseTypeSubscription = this.form.controls[
      'exerciseType'
    ].valueChanges.subscribe({
      next: (newValue) => {
        const nameControl = (this.form.controls['newExerciseType'] as FormGroup)
          .controls['name'];
        if (newValue) {
          this.showNewExerciseTypeForm.set(false);
          nameControl.setValidators([]);
        } else {
          nameControl.setValidators([Validators.required]);
        }
        nameControl.updateValueAndValidity();
      },
    });
    this.destroyRef.onDestroy(() => {
      weightedSubscription.unsubscribe();
      progressTypeSubscription.unsubscribe();
      exerciseTypeSubscription.unsubscribe();
    });
  }

  get exerciseType() {
    return this.form.value.exerciseType;
  }

  get weighted() {
    return this.form.value.weighted;
  }

  get weightType() {
    return this.form.value.weightType;
  }

  get progressType() {
    return this.form.value.progressType;
  }

  get showError() {
    return this.firstCreateClick && this.form.dirty && this.form.invalid;
  }

  onSubmitExercise() {
    this.firstCreateClick = true;
    this.markAsDirty();
    if (this.form.valid) {
      const exerciseType: ExerciseType = this.exerciseType || {
        id: Date.now(),
        name: this.form.value.newExerciseType!.name!,
        image: this.form.value.newExerciseType!.image!,
      };
      const newExercise: Exercise = {
        id: this.exerciseId,
        type: exerciseType,
        progressType: this.form.value.progressType!,
        weighted: this.form.value.weighted!,
        weightType: this.form.value.weightType!,
        sets: this.form.value.sets?.sets?.map(this.getSet)!,
      };
      this.resetForm();
      this.exercise.emit(newExercise);
    }
  }

  onOpenExerciseDialog() {
    this.showExerciseTypeDialog.set(true);
  }

  onShowNewExerciseTypeForm() {
    this.form.patchValue({ exerciseType: null });
    this.showNewExerciseTypeForm.set(true);
  }

  private getSet(
    set: Partial<{
      id: number | null;
      weight: number | null;
      repetitions: number | null;
      time: number | null;
    }>,
  ) {
    return {
      id: set.id!,
      weight: set.weight!,
      repetitions: set.repetitions!,
      time: set.time!,
    };
  }

  onSelectExerciseType(exerciseType: ExerciseType) {
    this.form.controls['exerciseType'].setValue(exerciseType);
    this.form.controls['exerciseType'].updateValueAndValidity();
  }

  resetForm() {
    this.fillForm({
      id: Date.now(),
      type: null,
      weighted: true,
      weightType: WeightType.total,
      progressType: ProgressType.repetitions,
      sets: Array.from({ length: this.numberOfSets() }, () => ({
        weight: 5,
        repetitions: 10,
        time: 60,
      })),
    });
  }

  fillForm(exercise: Exercise) {
    this.exerciseId = exercise.id;
    this.dirty = false;
    this.showNewExerciseTypeForm.set(false);
    this.form.patchValue({
      exerciseType: exercise.type,
      newExerciseType: { name: '', image: undefined },
      weighted: exercise.weighted,
      weightType: exercise.weightType,
      progressType: exercise.progressType,
    });
    this.form.controls['sets'].controls['sets'].clear();
    exercise.sets.forEach((set) => {
      this.form.controls['sets'].controls['sets'].push(
        getNewFormGroupForSet(set, exercise.weighted, exercise.progressType),
      );
    });
    this.form.markAsPristine();
  }

  private markAsDirty() {
    if (!this.dirty) {
      this.dirty = true;
      const queue: AbstractControl[] = [this.form];
      while (queue.length) {
        const control = queue.pop();
        control!.markAsDirty();
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach((key) => {
            queue.push(control.get(key)!);
          });
        }
      }
    }
  }

  onHideSupersetSetsWarning() {
    this.hideSupersetSetsWarning.set(true);
  }
}
