import { Component, input } from '@angular/core';
import { Superset } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'gym-superset-option',
  imports: [ExerciseImageComponent, TranslatePipe, IconComponent],
  templateUrl: './superset-option.component.html',
  styleUrl: './superset-option.component.scss',
})
export class SupersetOptionComponent {
  superset = input.required<Superset>();
}
