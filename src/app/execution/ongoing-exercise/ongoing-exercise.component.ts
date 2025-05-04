import { Component, computed, input } from '@angular/core';
import { Exercise } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/icon/icon.component';
import { TimePipe } from '../../shared/pipes/time/time.pipe';

@Component({
  selector: 'gym-ongoing-exercise',
  imports: [ExerciseImageComponent, TranslatePipe, IconComponent, TimePipe],
  templateUrl: './ongoing-exercise.component.html',
  styleUrl: './ongoing-exercise.component.scss',
})
export class OngoingExerciseComponent {
  exercise = input.required<Exercise>();
  setIndex = input.required<number>();
  set = computed(() => {
    return this.exercise().sets[this.setIndex()];
  });
}
