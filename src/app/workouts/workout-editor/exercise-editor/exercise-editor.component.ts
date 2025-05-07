import {
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import {
  ExerciseType,
  WeightType,
  ProgressType,
  Exercise,
} from '../../../gym.model';
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
} from './sets-editor/sets-editor.component';
import { SwitchComponent } from '../../../shared/switch/switch.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { DialogComponent } from '../../../shared/dialog/dialog.component';
import { ExerciseTypeEditorComponent } from './exercise-type-editor/exercise-type-editor.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { TimeInputComponent } from '../../../shared/time-input/time-input.component';
import { CloseableWarningComponent } from '../../../shared/closeable-warning/closeable-warning.component';

@Component({
  selector: 'gym-exercise-editor',
  imports: [
    FormsModule,
    SetsEditorComponent,
    SwitchComponent,
    IconComponent,
    ReactiveFormsModule,
    DialogComponent,
    ExerciseTypeEditorComponent,
    TranslatePipe,
    TimeInputComponent,
    CloseableWarningComponent,
  ],
  templateUrl: './exercise-editor.component.html',
  styleUrl: './exercise-editor.component.scss',
})
export class ExerciseEditorComponent {
  HIDE_SUPERSET_SETS_WARNING_KEY = 'gym-hide-superset-sets-warning';
  HIDE_SUPERSET_RESTING_TIME_WARNING_KEY =
    'gym-hide-superset-resting-time-warning';

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

  titleKey = computed(() => {
    return `exercises.editor.${this.editMode() ? 'edit' : 'new'}`;
  });

  submitKey = computed(() => {
    return `exercises.editor.${this.editMode() ? 'save' : 'add'}`;
  });

  errorsKey = computed(() => {
    return `exercises.editor.${this.editMode() ? 'errorSave' : 'errorAdd'}`;
  });

  private exerciseId!: number;
  private firstSubmitClick = false;
  private dirty = false;

  form = new FormGroup({
    type: new FormGroup({
      exerciseType: new FormControl<ExerciseType | null>(null),
      newExerciseType: new FormGroup({
        name: new FormControl('', [Validators.required]),
        image: new FormControl<string | undefined>(undefined),
      }),
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
    restingTime: new FormControl(60),
  });

  constructor() {
    //for filling the form with either the provided exercise or with a new one
    effect(() => {
      if (this.baseExercise()) this.fillForm(this.baseExercise()!);
      else this.resetForm();
    });
    //for resetting the form after closing
    effect(() => {
      if (!this.open()) this.resetForm();
    });
    //for updating some controls' validators depending on other controls' values
    //this updates the weight controls validators depending on weighted flag
    this.form.controls['weighted'].valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (newValue) => {
          for (const set of (
            (this.form.controls['sets'] as FormGroup).controls[
              'sets'
            ] as FormArray<FormGroup>
          ).controls) {
            set.controls['weight'].setValidators(
              getWeightValidators(newValue!),
            );
            set.controls['weight'].updateValueAndValidity();
          }
        },
      });
    //this updates time and repetitions controls validators depending on progressType flag
    this.form.controls['progressType'].valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
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
    this.form.controls['type'].controls['exerciseType'].valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (newValue) => {
          const nameControl = (
            this.form.controls['type'].controls['newExerciseType'] as FormGroup
          ).controls['name'];
          if (newValue) {
            nameControl.setValidators([]);
          } else {
            nameControl.setValidators([Validators.required]);
          }
          nameControl.updateValueAndValidity();
        },
      });
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
    return this.firstSubmitClick && this.form.dirty && this.form.invalid;
  }

  onSubmitExercise() {
    this.firstSubmitClick = true;
    this.markAsDirty();
    if (this.form.valid) {
      const exerciseType: ExerciseType = this.form.value.type!.exerciseType || {
        id: Date.now(),
        name: this.form.value.type!.newExerciseType!.name!,
        image: this.form.value.type!.newExerciseType!.image!,
      };
      const newExercise: Exercise = {
        id: this.exerciseId,
        type: exerciseType,
        progressType: this.form.value.progressType!,
        weighted: this.form.value.weighted!,
        weightType: this.form.value.weightType!,
        sets: this.form.value.sets?.sets?.map(this.getSet)!,
        restingTime: this.form.value.restingTime!,
      };
      this.resetForm();
      this.exercise.emit(newExercise);
    }
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
      weight: set.weight!,
      repetitions: set.repetitions!,
      time: set.time!,
    };
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
      restingTime: 60,
    });
  }

  fillForm(exercise: Exercise) {
    this.firstSubmitClick = false;
    this.exerciseId = exercise.id;
    this.dirty = false;
    this.form.patchValue({
      type: {
        exerciseType: exercise.type,
        newExerciseType: { name: '', image: undefined },
      },
      weighted: exercise.weighted,
      weightType: exercise.weightType,
      progressType: exercise.progressType,
      restingTime: exercise.restingTime,
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
}
