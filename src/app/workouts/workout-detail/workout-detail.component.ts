import { Component, effect, inject, input, signal } from '@angular/core';
import { Workout } from '../../gym.model';
import { WorkoutService } from '../../workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BackLinkComponent } from '../../shared/back-link/back-link.component';
import { asExercise, asSuperset, isExercise } from '../../utils';
import { ExerciseComponent } from '../../exercise/exercise.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { DeleteWarningDialogComponent } from '../../shared/dialog/delete-warning-dialog/delete-warning-dialog.component';
import { ExecutionService } from '../../execution.service';

@Component({
  selector: 'gym-workout-detail',
  imports: [
    TranslatePipe,
    DatePipe,
    RouterLink,
    BackLinkComponent,
    ExerciseComponent,
    IconComponent,
    DeleteWarningDialogComponent,
  ],
  templateUrl: './workout-detail.component.html',
  styleUrl: './workout-detail.component.scss',
})
export class WorkoutDetailComponent {
  id = input.required<string>();
  workoutService = inject(WorkoutService);
  executionService = inject(ExecutionService);
  router = inject(Router);
  workout?: Workout;
  showAskDeleteWorkout = signal(false);

  constructor() {
    effect(() => {
      this.workout = this.workoutService
        .workouts()
        .find((workout) => workout.id === +this.id());
      if (!this.workout) this.router.navigate(['workouts']);
    });
  }

  asExercise = asExercise;

  asSuperset = asSuperset;

  isExercise = isExercise;

  onAskDeleteWorkout() {
    this.showAskDeleteWorkout.set(true);
  }

  async onDeleteWorkout() {
    await this.workoutService.deleteWorkout(+this.id());
    this.router.navigate(['workouts']);
  }

  onStartWorkout() {
    this.executionService.startWorkout(+this.id());
  }
}
