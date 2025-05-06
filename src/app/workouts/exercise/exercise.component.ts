import { Component, input } from '@angular/core';
import { Exercise } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { SetComponent } from './set/set.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { TimePipe } from '../../shared/pipes/time/time.pipe';

@Component({
  selector: 'gym-exercise',
  imports: [ExerciseImageComponent, SetComponent, IconComponent, TimePipe],
  templateUrl: './exercise.component.html',
  styleUrl: './exercise.component.scss',
})
export class ExerciseComponent {
  exercise = input.required<Exercise>();
}
