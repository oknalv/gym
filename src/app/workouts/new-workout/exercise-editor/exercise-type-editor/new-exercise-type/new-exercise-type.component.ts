import {
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExerciseImageComponent } from '../../../../../shared/exercise-image/exercise-image.component';
import { TextInputComponent } from '../../../../../shared/text-input/text-input.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-new-exercise-type',
  imports: [
    ReactiveFormsModule,
    ExerciseImageComponent,
    TextInputComponent,
    TranslatePipe,
  ],
  templateUrl: './new-exercise-type.component.html',
  styleUrl: './new-exercise-type.component.scss',
})
export class NewExerciseTypeComponent implements OnInit {
  imageInput = viewChild<ElementRef<HTMLInputElement>>('imageInput');

  controlContainer = inject(ControlContainer);

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  get src(): string {
    return this.form.controls['image'].value;
  }

  get name(): string {
    return this.form.controls['name'].value;
  }

  onLoadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(input.files![0]);
    };
    input.click();
  }

  onDeleteImage() {
    this.form.patchValue({ image: undefined });
  }
}
