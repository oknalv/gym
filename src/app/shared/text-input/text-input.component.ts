import {
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'gym-text-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor, OnInit {
  label = input.required<string>();
  placeholder = computed(() => {
    if (this.control?.hasValidator(Validators.required)) {
      return this.label() + ' *';
    }
    return this.label();
  });
  errorMessage = input<string>();
  controlContainer = inject(ControlContainer);
  value = signal('');
  disabled = signal(false);

  formControlName = input<string>();
  formControl = input<FormControl>();

  private control!: FormControl<string>;

  private touched = false;
  private onChange = (text: string) => {};
  private onTouched = () => {};

  constructor() {}

  get showError() {
    return this.errorMessage() && this.control?.dirty && this.control.invalid;
  }

  ngOnInit() {
    if (this.formControlName()) {
      this.control = this.controlContainer.control!.get(
        this.formControlName()!,
      )! as FormControl<string>;
    } else if (this.formControl()) {
      this.control = this.formControl()!;
    }
  }

  onType() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
    this.onChange(this.value());
  }

  writeValue(text: string) {
    this.value.set(text);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
