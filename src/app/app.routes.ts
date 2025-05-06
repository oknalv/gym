import { Routes } from '@angular/router';
import { WorkoutsComponent } from './workouts/workouts.component';
import { WorkoutEditorComponent } from './workouts/workout-editor/workout-editor.component';
import { WorkoutDetailComponent } from './workouts/workout-detail/workout-detail.component';
import { ExecutionComponent } from './execution/execution.component';
import { ConfigurationComponent } from './configuration/configuration.component';

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
  {
    path: 'execution',
    component: ExecutionComponent,
  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
  },
];
