import { Component, effect, inject, input } from '@angular/core';
import { Workout } from '../../gym.model';
import { WorkoutService } from '../../workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BackLinkComponent } from '../../shared/back-link/back-link.component';
import { asExercise, asSuperset, isExercise } from '../../utils';
import { ExerciseComponent } from '../../exercise/exercise.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'gym-workout-detail',
  imports: [
    TranslatePipe,
    DatePipe,
    RouterLink,
    BackLinkComponent,
    ExerciseComponent,
    IconComponent,
  ],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss',
})
export class WorkoutDetailComponent {
  id = input.required<string>();
  workoutService = inject(WorkoutService);
  router = inject(Router);
  workout?: Workout;

  constructor() {
    effect(() => {
      this.workout = this.workoutService
        .workouts()
        .find((workout) => workout.id === +this.id());
      if (!this.workout) this.router.navigate(['..']);
    });
  }

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;
}
