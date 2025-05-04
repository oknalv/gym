import { Component } from '@angular/core';
import { OngoingExerciseComponent } from '../ongoing-exercise.component';
import { ExerciseImageComponent } from '../../../shared/exercise-image/exercise-image.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { TimePipe } from '../../../shared/pipes/time/time.pipe';

@Component({
  selector: 'gym-ongoing-superset-exercise',
  imports: [ExerciseImageComponent, IconComponent, TimePipe],
  templateUrl: './ongoing-superset-exercise.component.html',
  styleUrl: './ongoing-superset-exercise.component.scss',
})
export class OngoingSupersetExerciseComponent extends OngoingExerciseComponent {}
