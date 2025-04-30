import { Component, effect, input, model, signal } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { getHoursMinutesAndSeconds, integerValidator } from '../../../utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TimeEditorDialogInputComponent } from './time-editor-dialog-input/time-editor-dialog-input.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-time-editor-dialog',
  imports: [
    DialogComponent,
    ReactiveFormsModule,
    TimeEditorDialogInputComponent,
    TranslatePipe,
  ],
  templateUrl: './time-editor-dialog.component.html',
  styleUrl: './time-editor-dialog.component.scss',
})
export class TimeEditorDialogComponent {
  open = model.required<boolean>();
  value = model.required<number>();
  form = new FormGroup({
    hours: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      integerValidator,
    ]),
    minutes: new FormControl<number>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(59),
      integerValidator,
    ]),
    seconds: new FormControl<number>(1, getSecondsValidators(0, 0)),
  });
  private firstSubmitClick = false;

  constructor() {
    effect(() => {
      this.form.patchValue(getHoursMinutesAndSeconds(this.value()));
    });
    this.form.controls.hours.valueChanges.pipe(takeUntilDestroyed()).subscribe({
      next: (newValue) => {
        this.form.controls.seconds.setValidators(
          getSecondsValidators(newValue, this.form.value.minutes),
        );
        this.form.controls.seconds.updateValueAndValidity();
      },
    });
    this.form.controls.minutes.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (newValue) => {
          this.form.controls.seconds.setValidators(
            getSecondsValidators(this.form.value.hours, newValue),
          );
          this.form.controls.seconds.updateValueAndValidity();
        },
      });
  }

  get showError() {
    return this.firstSubmitClick && this.form.invalid;
  }

  onCancel() {
    this.form.patchValue(getHoursMinutesAndSeconds(this.value()));
    this.open.set(false);
  }

  onAccept() {
    this.firstSubmitClick = true;
    if (this.form.valid) {
      const newTime =
        this.form.value.hours! * 3600 +
        this.form.value.minutes! * 60 +
        this.form.value.seconds!;
      this.value.set(newTime);
      this.open.set(false);
    }
  }
}

function getSecondsValidators(
  hours: number | null | undefined,
  minutes: number | null | undefined,
) {
  return [
    Validators.required,
    Validators.min(hours === 0 && minutes === 0 ? 1 : 0),
    Validators.max(59),
    integerValidator,
  ];
}
