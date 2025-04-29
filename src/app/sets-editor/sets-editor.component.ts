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
import { IconComponent } from '../shared/icon/icon.component';
import { ExerciseSet, ProgressType, WeightType } from '../gym.model';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

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
      { weight: 5, repetitions: 10, time: 60 },
      this.weighted(),
      this.progressType(),
    );
    newForm.patchValue({ ...this.sets.at(-1)!.value, id: setId++ });
    this.sets.push(newForm);
  }

  onDeleteSet(index: number) {
    this.sets.removeAt(index);
  }
}

export function getWeightValidators(weighted: boolean) {
  return weighted ? [Validators.required, Validators.min(0)] : [];
}

export function getRepetitionsValidators(progressType: ProgressType) {
  return progressType === ProgressType.repetitions
    ? [
        Validators.required,
        Validators.min(1),
        (control: AbstractControl) => {
          if (control.value % 1 === 0) return null;
          return { notInteger: true };
        },
      ]
    : [];
}

export function getTimeValidators(progressType: ProgressType) {
  return progressType === ProgressType.repetitions
    ? getRepetitionsValidators(ProgressType.time)
    : getRepetitionsValidators(ProgressType.repetitions);
}

export function getNewFormGroupForSet(
  set: ExerciseSet,
  weighted: boolean,
  progressType: ProgressType,
) {
  return new FormGroup({
    id: new FormControl<number>(setId++),
    weight: new FormControl<number>(set.weight, getWeightValidators(weighted)),
    repetitions: new FormControl<number>(
      set.repetitions,
      getRepetitionsValidators(progressType),
    ),
    time: new FormControl<number>(set.time, getTimeValidators(progressType)),
  });
}
