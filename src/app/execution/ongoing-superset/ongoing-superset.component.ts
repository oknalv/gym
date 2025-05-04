import { Component, input } from '@angular/core';
import { Superset } from '../../gym.model';
import { OngoingSupersetExerciseComponent } from '../ongoing-exercise/ongoing-superset-exercise/ongoing-superset-exercise.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-ongoing-superset',
  imports: [OngoingSupersetExerciseComponent, TranslatePipe],
  templateUrl: './ongoing-superset.component.html',
  styleUrl: './ongoing-superset.component.scss',
})
export class OngoingSupersetComponent {
  superset = input.required<Superset>();
  setIndex = input.required<number>();
}
