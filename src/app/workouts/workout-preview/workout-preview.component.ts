import { Component, computed, input } from '@angular/core';
import { Exercise, Superset, Workout } from '../../gym.model';

@Component({
  selector: 'gym-workout-preview',
  imports: [],
  templateUrl: './workout-preview.component.html',
  styleUrl: './workout-preview.component.scss',
})
export class WorkoutPreviewComponent {
  workout = input.required<Workout>();
  exerciseCount = computed(() => {
    let count = 0;
    for (const exercise of this.workout().exercises) {
      if ((exercise as Exercise).type) count++;
      else count += (exercise as Superset).exercises.length;
    }
    return count;
  });
}
