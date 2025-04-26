import {
  Component,
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
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { IconComponent } from '../../../shared/icon/icon.component';

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
export class SetEditorInputComponent implements ControlValueAccessor, OnInit {
  value!: WritableSignal<number>;
  icon = input.required<string>();
  label = input.required<string>();

  formControlName = input<string>();
  formControl = input<FormControl>();
  controlContainer = inject(ControlContainer);

  private onChange = (value: number) => {};

  private control!: FormControl<number>;

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
