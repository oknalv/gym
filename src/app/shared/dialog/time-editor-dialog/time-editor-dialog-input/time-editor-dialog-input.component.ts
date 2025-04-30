import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-time-editor-dialog-input',
  imports: [FormsModule, TranslatePipe],
  templateUrl: './time-editor-dialog-input.component.html',
  styleUrl: './time-editor-dialog-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeEditorDialogInputComponent),
      multi: true,
    },
  ],
})
export class TimeEditorDialogInputComponent
  implements ControlValueAccessor, OnInit
{
  value!: WritableSignal<number>;
  label = input.required<string>();
  formattedValue = computed(() => {
    if (this.value() === null || this.value() === undefined) return '\xA0';
    if (this.value() < 0) return this.value();
    if (this.label() === 'hours' || this.value() > 9) return this.value() + '';
    return '0' + this.value();
  });
  labelKey = computed(() => {
    return `shared.timeEditorDialog.${this.label()}`;
  });

  formControlName = input<string>();
  formControl = input<FormControl>();
  controlContainer = inject(ControlContainer);
  editing = signal(false);
  input = viewChild<ElementRef<HTMLInputElement>>('input');

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

  onFocus() {
    this.editing.set(true);
    this.input()!.nativeElement.select();
  }

  onBlur() {
    this.editing.set(false);
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
