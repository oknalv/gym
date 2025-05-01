import { Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts/workouts.component';
import { NewWorkoutComponent } from './workouts/new-workout/new-workout.component';
import { WorkoutDetailComponent } from './workouts/workout-detail/workout-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'workouts',
    pathMatch: 'full',
  },
  {
    path: 'workouts',
    component: WorkoutsComponent,
  },
  {
    path: 'workouts/:id',
    component: WorkoutDetailComponent,
  },
  {
    path: 'new-workout',
    component: NewWorkoutComponent,
  },
];
