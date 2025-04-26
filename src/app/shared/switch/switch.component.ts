import {
  Component,
  computed,
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
export class SwitchComponent<T> implements ControlValueAccessor, OnInit {
  options = input.required<SwitchOptions<T>>();
  value!: WritableSignal<T>;

  formControlName = input<string>();
  formControl = input<FormControl>();
  controlContainer = inject(ControlContainer);
  disabled = signal(false);

  private onChange = (option: T) => {};

  private control!: FormControl<T>;

  selectedOn = computed(() => {
    return !this.disabled() && this.value() === this.options().on;
  });

  selectedOff = computed(() => {
    return !this.disabled() && this.value() === this.options().off;
  });

  constructor() {}

  ngOnInit(): void {
    if (this.formControlName()) {
      this.control = this.controlContainer.control!.get(
        this.formControlName()!,
      )! as FormControl<T>;
    } else if (this.formControl()) {
      this.control = this.formControl()!;
    }
    this.value = signal(this.control.value);
  }

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
