import { Component, inject } from '@angular/core';
import { WorkoutPreviewComponent } from './workout-preview/workout-preview.component';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../workout.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'gym-workouts',
  imports: [WorkoutPreviewComponent, RouterLink, TranslatePipe],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent {
  private workoutService = inject(WorkoutService);
  workouts = this.workoutService.workouts;
}
