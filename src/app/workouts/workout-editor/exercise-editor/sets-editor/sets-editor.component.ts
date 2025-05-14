import {
  AfterViewChecked,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { SetEditorComponent } from './set-editor/set-editor.component';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ExerciseSet, ProgressType, WeightType } from '../../../../gym.model';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { integerValidator } from '../../../../utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

let setId = 0;

@Component({
  selector: 'gym-sets-editor',
  imports: [
    SetEditorComponent,
    IconComponent,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './sets-editor.component.html',
  styleUrl: './sets-editor.component.scss',
})
export class SetsEditorComponent implements AfterViewChecked, OnInit {
  private controlContainer = inject(ControlContainer);
  weighted = input.required<boolean>();
  weightType = input.required<WeightType>();
  progressType = input.required<ProgressType>();
  private destroyRef = inject(DestroyRef);

  form!: FormGroup;

  private setsEditor = viewChild<ElementRef<HTMLElement>>('setsEditor');
  private count = 0;

  invalidWeight = signal(false);
  invalidRepetitions = signal(false);

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
    this.count = this.sets.length;

    const subscription = this.form.valueChanges.subscribe({
      next: () => {
        let weightError = false;
        let repetitionsError = false;
        for (const form of this.sets.controls) {
          if (form.controls['weight'].errors) weightError = true;
          if (form.controls['repetitions'].errors) repetitionsError = true;
        }
        this.invalidWeight.set(weightError);
        this.invalidRepetitions.set(repetitionsError);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  get sets() {
    return this.form.controls['sets'] as FormArray<FormGroup>;
  }

  getSetId(index: number) {
    return this.getSetForm(index).controls;
  }

  getSetForm(index: number) {
    return this.sets.at(index) as FormGroup;
  }

  ngAfterViewChecked(): void {
    if (this.sets.length < this.count) {
      this.count--;
    } else if (this.sets.length > this.count) {
      this.setsEditor()!.nativeElement.scrollLeft =
        this.setsEditor()!.nativeElement.scrollWidth;
      this.count++;
    }
  }

  onAddSet() {
    const newForm = getNewFormGroupForSet(
      { weight: 5, repetitions: 10, time: 60, failure: false },
      this.weighted(),
      this.progressType(),
      this.destroyRef,
    );
    this.sets.push(newForm);
    newForm.patchValue({ ...this.sets.at(-2)!.value, id: setId++ });
  }

  onDeleteSet(index: number) {
    this.sets.removeAt(index);
  }
}

export function getWeightValidators(weighted: boolean) {
  return weighted ? [Validators.required, Validators.min(0)] : [];
}

export function getRepetitionsValidators(
  progressType: ProgressType,
  failure: boolean,
) {
  return progressType === ProgressType.repetitions && !failure
    ? [Validators.required, Validators.min(1), integerValidator]
    : [];
}

export function getTimeValidators(
  progressType: ProgressType,
  failure: boolean,
) {
  return progressType === ProgressType.repetitions
    ? getRepetitionsValidators(ProgressType.time, failure)
    : getRepetitionsValidators(ProgressType.repetitions, failure);
}

export function getNewFormGroupForSet(
  set: ExerciseSet,
  weighted: boolean,
  progressType: ProgressType,
  destroyRef: DestroyRef,
) {
  const formGroup = new FormGroup({
    id: new FormControl(setId++),
    weight: new FormControl(set.weight, getWeightValidators(weighted)),
    repetitions: new FormControl(
      set.repetitions,
      getRepetitionsValidators(progressType, set.failure),
    ),
    time: new FormControl<number>(
      set.time,
      getTimeValidators(progressType, set.failure),
    ),
    failure: new FormControl(set.failure),
  });
  formGroup.controls.failure.valueChanges
    .pipe(takeUntilDestroyed(destroyRef))
    .subscribe({
      next: (newValue) => {
        formGroup.controls.repetitions.setValidators(
          getRepetitionsValidators(
            (
              formGroup.root! as FormGroup<{
                progressType: FormControl<ProgressType>;
              }>
            ).controls.progressType.value,
            newValue!,
          ),
        );
        formGroup.controls.repetitions.updateValueAndValidity();
      },
    });
  return formGroup;
}
