import {
  Component,
  computed,
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
import { ProgressType, WeightType } from '../../../../../gym.model';
import { SetEditorInputComponent } from './set-editor-input/set-editor-input.component';
import { SetEditorTimeInputComponent } from './set-editor-time-input/set-editor-time-input.component';
import { ConfigurationService } from '../../../../../services/configuration.service';
import { IconComponent } from '../../../../../shared/icon/icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-set-editor',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SetEditorInputComponent,
    SetEditorTimeInputComponent,
    IconComponent,
    TranslatePipe,
  ],
  templateUrl: './set-editor.component.html',
  styleUrl: './set-editor.component.scss',
})
export class SetEditorComponent implements OnInit {
  formGroup = input<FormGroup>();
  weighted = input.required<boolean>();
  weightType = input.required<WeightType>();
  progressType = input.required<ProgressType>();
  controlContainer = inject(ControlContainer);
  private configurationService = inject(ConfigurationService);
  weightUnit = computed(() => {
    return this.configurationService.configuration().weightUnit;
  });

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  get failure() {
    return this.form.value.failure as boolean;
  }

  get failureChangeKey() {
    return 'exercises.editor.sets.' + (this.failure ? 'toValue' : 'toFailure');
  }

  onChangeFailure() {
    this.form.controls['failure'].setValue(!this.failure);
  }
}
