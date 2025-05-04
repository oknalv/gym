import {
  Component,
  effect,
  forwardRef,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IconComponent } from '../../../../../../shared/icon/icon.component';
import { TimeEditorDialogComponent } from '../../../../../../shared/dialog/time-editor-dialog/time-editor-dialog.component';
import { TimePipe } from '../../../../../../shared/pipes/time/time.pipe';

@Component({
  selector: 'gym-set-editor-time-input',
  imports: [IconComponent, TimeEditorDialogComponent, TimePipe],
  templateUrl: './set-editor-time-input.component.html',
  styleUrl: './set-editor-time-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SetEditorTimeInputComponent),
      multi: true,
    },
  ],
})
export class SetEditorTimeInputComponent implements ControlValueAccessor {
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
