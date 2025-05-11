import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TimerService } from '../timer.service';
import { WatchComponent } from '../shared/watch/watch.component';
import { getHoursMinutesSecondsAndMilliseconds } from '../utils';
import { IconComponent } from '../shared/icon/icon.component';
import { TimeEditorDialogComponent } from '../shared/dialog/time-editor-dialog/time-editor-dialog.component';
import { RunnerStatus } from '../common.model';
import { Subscription } from 'rxjs';

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
  private readonly MAIN_TIMER_KEY = 'gym-main-timer-paused-time';
  private readonly TIMER_ID = 'main-timer';
  private timerService = inject(TimerService);
  private translateService = inject(TranslateService);
  millisecondsToRun = signal(0);
  secondsToRun = computed(() => {
    return Math.floor(this.millisecondsToRun() / 1000);
  });
  timeToRun = computed(() => {
    return getHoursMinutesSecondsAndMilliseconds(this.millisecondsToRun());
  });
  private time = signal(0);
  splittedTime = computed(() => {
    return getHoursMinutesSecondsAndMilliseconds(this.time());
  });
  timeEditorDialogVisible = signal(false);
  status = signal(RunnerStatus.stop);
  private timerSubscription?: Subscription;
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.timerSubscription = this.timerService
      .getTimer(this.TIMER_ID)
      ?.subscribe({
        next: (value) => {
          this.time.set(value);
        },
        complete: () => {
          if (this.time() > 0) this.onPause();
          else this.onStop();
        },
      });
    if (this.timerSubscription) {
      this.status.set(RunnerStatus.play);
    } else {
      const pausedTime = JSON.parse(
        window.localStorage.getItem(this.MAIN_TIMER_KEY) || 'null',
      );
      if (pausedTime) {
        this.millisecondsToRun.set(pausedTime);
        this.time.set(pausedTime);
        this.status.set(RunnerStatus.pause);
      }
    }
    console.log(this.status());
    effect(() => {
      localStorage.setItem(
        this.MAIN_TIMER_KEY,
        JSON.stringify(
          this.status() === RunnerStatus.pause
            ? this.millisecondsToRun()
            : null,
        ),
      );
    });

    this.destroyRef.onDestroy(() => this.timerSubscription?.unsubscribe());
  }

  onPlay() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = this.timerService
      .play(
        this.TIMER_ID,
        this.millisecondsToRun(),
        this.translateService.instant('timer.finishMessage'),
      )
      ?.subscribe({
        next: (value) => {
          this.time.set(value);
        },
        complete: () => {
          if (this.time() > 0) this.onPause();
          else {
            this.onStop();
          }
        },
      });
    this.status.set(RunnerStatus.play);
  }

  onPause() {
    this.timerService.stop(this.TIMER_ID!);
    this.millisecondsToRun.set(this.time());
    this.status.set(RunnerStatus.pause);
  }

  onStop() {
    this.timerService.stop(this.TIMER_ID!);
    this.millisecondsToRun.set(0);
    this.status.set(RunnerStatus.stop);
  }

  setTime(milliseconds: number) {
    this.millisecondsToRun.set(milliseconds);
  }
}
