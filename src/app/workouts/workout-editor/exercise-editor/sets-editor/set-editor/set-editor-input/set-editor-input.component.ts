import { Component, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconComponent } from '../../../../../../shared/icon/icon.component';

@Component({
  selector: 'gym-set-editor-input',
  imports: [IconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './set-editor-input.component.html',
  styleUrl: './set-editor-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SetEditorInputComponent),
      multi: true,
    },
  ],
})
export class SetEditorInputComponent implements ControlValueAccessor {
  value = signal(1);
  icon = input.required<string>();
  label = input.required<string>();

  private onChange = (value: number) => {};

  onType() {
    this.onChange(this.value());
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
