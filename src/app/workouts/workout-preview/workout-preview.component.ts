import {
  Component,
  computed,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { Exercise, Superset, Workout } from '../../gym.model';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { asExercise, asSuperset, isExercise } from '../../utils';

@Component({
  selector: 'gym-workout-preview',
  imports: [TranslatePipe, DatePipe],
  templateUrl: './workout-preview.component.html',
  styleUrl: './workout-preview.component.scss',
})
export class WorkoutPreviewComponent {
  workout = input.required<Workout>();
  data = viewChild<ElementRef<HTMLElement>>('data');
  exerciseCount = computed(() => {
    let count = 0;
    for (const exercise of this.workout().exercises) {
      if ((exercise as Exercise).type) count++;
      else count += (exercise as Superset).exercises.length;
    }
    return count;
  });

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;
}
