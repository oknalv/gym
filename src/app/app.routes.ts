import { Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts/workouts.component';
import { WorkoutEditorComponent } from './workouts/workout-editor/workout-editor.component';
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
    path: 'workouts/new',
    component: WorkoutEditorComponent,
  },
  {
    path: 'workouts/:id',
    component: WorkoutDetailComponent,
  },
  {
    path: 'workouts/:id/edit',
    component: WorkoutEditorComponent,
  },
];
