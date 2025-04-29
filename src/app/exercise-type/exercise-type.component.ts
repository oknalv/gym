import { Component, input } from '@angular/core';
import { ExerciseType } from '../gym.model';
import { ExerciseImageComponent } from '../shared/exercise-image/exercise-image.component';

@Component({
  selector: 'gym-exercise-type',
  imports: [ExerciseImageComponent],
  templateUrl: './exercise-type.component.html',
  styleUrl: './exercise-type.component.scss',
})
export class ExerciseTypeComponent {
  type = input.required<ExerciseType>();
}
