import { Component, signal } from '@angular/core';
import { Workout } from './workout/workout.model';
import { WorkoutComponent } from './workout/workout.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'gym-workouts',
  imports: [WorkoutComponent, RouterLink],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent {
  workouts = signal<Workout[]>([]);
}
