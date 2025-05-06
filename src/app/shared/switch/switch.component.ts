import { Component, computed, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'gym-switch',
  imports: [],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent<T> implements ControlValueAccessor {
  options = input.required<SwitchOptions<T>>();

  value = signal<T | undefined>(undefined);

  disabled = signal(false);

  private onChange = (option: T) => {};

  selectedOn = computed(() => {
    return !this.disabled() && this.value() === this.options().on;
  });

  selectedOff = computed(() => {
    return !this.disabled() && this.value() === this.options().off;
  });

  constructor() {}

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

export interface SwitchOptions<T> {
  on: T;
  off: T;
}
