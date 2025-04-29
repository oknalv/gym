import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProgressType, WeightType } from '../../gym.model';
import { SetEditorInputComponent } from './set-editor-input/set-editor-input.component';

@Component({
  selector: 'gym-set-editor',
  imports: [ReactiveFormsModule, FormsModule, SetEditorInputComponent],
  templateUrl: './set-editor.component.html',
  styleUrl: './set-editor.component.scss',
})
export class SetEditorComponent implements OnInit {
  formGroup = input<FormGroup>();
  weighted = input.required<boolean>();
  weightType = input.required<WeightType>();
  progressType = input.required<ProgressType>();
  controlContainer = inject(ControlContainer);

  weight = signal(5);
  repetitions = signal(10);

  invalid = output<string[]>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }
}
