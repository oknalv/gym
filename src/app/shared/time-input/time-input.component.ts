import {
  Component,
  effect,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
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
export class TimeInputComponent implements ControlValueAccessor, OnInit {
  value!: WritableSignal<number>;
  formControlName = input<string>();
  formControl = input<FormControl>();
  controlContainer = inject(ControlContainer);
  control!: FormControl<number>;
  timeEditorDialogVisible = signal(false);

  private onChange = (value: number) => {};

  constructor() {
    effect(() => {
      this.onChange(this.value());
    });
  }

  ngOnInit(): void {
    if (this.formControlName()) {
      this.control = this.controlContainer.control!.get(
        this.formControlName()!,
      )! as FormControl<number>;
    } else if (this.formControl()) {
      this.control = this.formControl()!;
    }
    this.value = signal(this.control.value);
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
