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
import { TimeInputComponent } from '../../../../../../shared/time-input/time-input.component';

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
export class SetEditorTimeInputComponent extends TimeInputComponent {}
