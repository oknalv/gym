import { Component, computed, inject, signal } from '@angular/core';
import { WorkoutPreviewComponent } from './workout-preview/workout-preview.component';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../workout.service';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../shared/icon/icon.component';
import { ExerciseTypeManagerComponent } from './exercise-type-manager/exercise-type-manager.component';
import { PortService } from '../port.service';

@Component({
  selector: 'gym-workouts',
  imports: [
    WorkoutPreviewComponent,
    RouterLink,
    TranslatePipe,
    IconComponent,
    ExerciseTypeManagerComponent,
  ],
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.scss',
})
export class WorkoutsComponent {
  private workoutService = inject(WorkoutService);
  workouts = computed(() => {
    return this.workoutService.workouts().sort((a, b) => {
      if (!a.lastExecution && !b.lastExecution) {
        return a.name < b.name ? -1 : 1;
      }
      if (!a.lastExecution) return -1;
      if (!b.lastExecution) return 1;
      return a.lastExecution.getTime() - b.lastExecution.getTime();
    });
  });
  hasExerciseTypes = computed(() => {
    return this.workoutService.exerciseTypes().length > 0;
  });
  manageExerciseTypesVisible = signal(false);
  private portService = inject(PortService);

  onShowManageExerciseTypes() {
    this.manageExerciseTypesVisible.set(true);
  }

  async onExportData() {
    await this.portService.export();
  }

  async onImportData() {
    await this.portService.import();
    window.location.reload();
  }
}
