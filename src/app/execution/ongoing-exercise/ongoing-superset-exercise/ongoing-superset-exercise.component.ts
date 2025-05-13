import { Component } from '@angular/core';
import { OngoingExerciseComponent } from '../ongoing-exercise.component';
import { ExerciseImageComponent } from '../../../shared/exercise-image/exercise-image.component';
import { OngoingSetComponent } from '../ongoing-set/ongoing-set.component';
import { SwitchComponent } from '../../../shared/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'gym-ongoing-superset-exercise',
  imports: [
    ExerciseImageComponent,
    OngoingSetComponent,
    SwitchComponent,
    FormsModule,
    IconComponent,
  ],
  templateUrl: './ongoing-superset-exercise.component.html',
  styleUrl: './ongoing-superset-exercise.component.scss',
})
export class OngoingSupersetExerciseComponent extends OngoingExerciseComponent {}
