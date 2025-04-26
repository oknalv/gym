import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'gym-exercise-image',
  imports: [IconComponent],
  templateUrl: './exercise-image.component.html',
  styleUrl: './exercise-image.component.scss',
})
export class ExerciseImageComponent {
  alt = input.required<string>();
  src = input.required<string>();
}
