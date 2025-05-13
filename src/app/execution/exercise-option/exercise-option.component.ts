import { Component, input } from '@angular/core';
import { Exercise } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'gym-exercise-option',
  imports: [ExerciseImageComponent, TranslatePipe, IconComponent],
  templateUrl: './exercise-option.component.html',
  styleUrl: './exercise-option.component.scss',
})
export class ExerciseOptionComponent {
  exercise = input.required<Exercise>();
}
