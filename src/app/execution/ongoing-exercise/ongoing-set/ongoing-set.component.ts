import { Component, computed, inject, input, signal } from '@angular/core';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ExerciseSet, ProgressType, WeightType } from '../../../gym.model';
import { TimePipe } from '../../../shared/pipes/time/time.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerDialogComponent } from '../../../shared/dialog/timer-dialog/timer-dialog.component';
import { ConfigurationService } from '../../../configuration.service';

@Component({
  selector: 'gym-ongoing-set',
  imports: [IconComponent, TimePipe, TranslatePipe, TimerDialogComponent],
  templateUrl: './ongoing-set.component.html',
  styleUrl: './ongoing-set.component.scss',
})
export class OngoingSetComponent {
  weighted = input.required<boolean>();
  weightType = input.required<WeightType>();
  set = input.required<ExerciseSet>();
  progressType = input.required<ProgressType>();
  showTimer = signal(false);
  private configurationService = inject(ConfigurationService);
  weightUnit = computed(() => {
    return this.configurationService.configuration().weightUnit;
  });

  onRunTimer() {
    this.showTimer.set(true);
  }
}
