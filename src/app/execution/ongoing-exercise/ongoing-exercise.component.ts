import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Exercise, Remark } from '../../gym.model';
import { ExerciseImageComponent } from '../../shared/exercise-image/exercise-image.component';
import { TranslatePipe } from '@ngx-translate/core';
import { ExecutionActionsComponent } from '../execution-actions/execution-actions.component';
import { ExecutionService } from '../../execution.service';
import { OngoingSetComponent } from './ongoing-set/ongoing-set.component';
import { IconComponent } from '../../shared/icon/icon.component';
import { SwitchComponent } from '../../shared/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../workout.service';

@Component({
  selector: 'gym-ongoing-exercise',
  imports: [
    ExerciseImageComponent,
    TranslatePipe,
    ExecutionActionsComponent,
    OngoingSetComponent,
    IconComponent,
    SwitchComponent,
    FormsModule,
  ],
  templateUrl: './ongoing-exercise.component.html',
  styleUrl: './ongoing-exercise.component.scss',
})
export class OngoingExerciseComponent implements OnInit {
  timerId = input.required<string>();
  exercise = input.required<Exercise>();
  executionService = inject(ExecutionService);
  isLastExercise = input.required<boolean>();
  setIndex = computed(() => {
    return this.executionService.ongoingExecution()!.setIndex;
  });
  isLastSet = computed(() => {
    return this.exercise().sets.length - 1 === this.setIndex();
  });
  set = computed(() => {
    return this.exercise().sets[this.setIndex()];
  });
  remark = signal<Remark | null>(null);
  private workoutService = inject(WorkoutService);

  ngOnInit() {
    this.remark.set(this.exercise().remark);
  }

  async onRemarkChange(remark: Remark | null) {
    await this.workoutService.changeRemarkOfOngoingWorkoutExercise(
      this.exercise().id,
      remark,
    );
  }
}
