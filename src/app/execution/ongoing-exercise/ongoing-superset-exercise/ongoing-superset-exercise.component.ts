import { Component } from '@angular/core';
import { OngoingExerciseComponent } from '../ongoing-exercise.component';
import { ExerciseImageComponent } from '../../../shared/exercise-image/exercise-image.component';
import { IconComponent } from '../../../shared/icon/icon.component';
import { TimePipe } from '../../../shared/pipes/time/time.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerDialogComponent } from '../../../shared/dialog/timer-dialog/timer-dialog.component';
import { OngoingSetComponent } from '../ongoing-set/ongoing-set.component';

@Component({
  selector: 'gym-ongoing-superset-exercise',
  imports: [ExerciseImageComponent, OngoingSetComponent],
  templateUrl: './ongoing-superset-exercise.component.html',
  styleUrl: './ongoing-superset-exercise.component.scss',
})
export class OngoingSupersetExerciseComponent extends OngoingExerciseComponent {}
