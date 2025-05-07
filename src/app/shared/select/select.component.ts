import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  contentChild,
  forwardRef,
  input,
  signal,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'gym-select',
  imports: [NgTemplateOutlet],
  templateUrl: './select.component.html',
  styleUrl: '../switch/switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T> implements ControlValueAccessor {
  options = input.required<T[]>();
  optionTemplate = contentChild<TemplateRef<unknown>>(TemplateRef);

  value = signal<T | undefined>(undefined);

  disabled = signal(false);

  private onChange = (option: T) => {};

  select(option: T) {
    this.value.set(option);
    this.onChange(option);
  }

  writeValue(option: T): void {
    this.value.set(option);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  registerOnTouched(onTouched: any) {}
}
