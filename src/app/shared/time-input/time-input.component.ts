import { Component, effect, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TimeEditorDialogComponent } from '../dialog/time-editor-dialog/time-editor-dialog.component';
import { TimePipe } from '../pipes/time/time.pipe';

@Component({
  selector: 'gym-time-input',
  imports: [TimeEditorDialogComponent, TimePipe],
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    },
  ],
})
export class TimeInputComponent implements ControlValueAccessor {
  value = signal(1);
  timeEditorDialogVisible = signal(false);

  private onChange = (value: number) => {};

  constructor() {
    effect(() => {
      this.onChange(this.value());
    });
  }

  showTimeEditorDialog() {
    this.timeEditorDialogVisible.set(true);
  }

  writeValue(value: number): void {
    this.value.set(value);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {}
  setDisabledState(isDisabled: boolean): void {}
}
