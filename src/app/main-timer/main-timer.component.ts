import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerService } from '../timer.service';
import { WatchComponent } from '../shared/watch/watch.component';
import { getHoursMinutesSecondsAndMilliseconds } from '../utils';
import { IconComponent } from '../shared/icon/icon.component';
import { TimeEditorDialogComponent } from '../shared/dialog/time-editor-dialog/time-editor-dialog.component';

@Component({
  selector: 'gym-main-timer',
  imports: [
    TranslatePipe,
    WatchComponent,
    IconComponent,
    TimeEditorDialogComponent,
  ],
  templateUrl: './main-timer.component.html',
  styleUrl: './main-timer.component.scss',
})
export class MainTimerComponent {
  private timerService = inject(TimerService);
  milliseconds = this.timerService.remainingMilliseconds;
  time = computed(() => {
    return getHoursMinutesSecondsAndMilliseconds(this.milliseconds());
  });
  timeEditorDialogVisible = signal(false);
  status = this.timerService.status;

  setTime(seconds: number) {
    this.timerService.setRemainingMilliseconds(seconds * 1000);
  }

  onPlay() {
    this.timerService.play();
  }

  onPause() {
    this.timerService.pause();
  }

  onStop() {
    this.timerService.stop();
  }
}
