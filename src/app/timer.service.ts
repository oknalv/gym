import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { RunnerStatus } from './common.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private TIMER_KEY = 'gym-timer';
  private startTime = signal<Date | null>(null);
  private millisecondsOffset = signal(0);
  private _status = signal<RunnerStatus>(RunnerStatus.stop);
  status = this._status.asReadonly();
  private _remainingMilliseconds = signal(0);
  remainingMilliseconds = this._remainingMilliseconds.asReadonly();
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private interval: number | null = null;

  constructor() {
    const timer: Timer | null = JSON.parse(
      window.localStorage.getItem(this.TIMER_KEY) || 'null',
    );
    if (timer) {
      this.millisecondsOffset.set(timer.millisecondsOffset);
      this._remainingMilliseconds.set(timer.millisecondsOffset);
      this._status.set(timer.status);
      if (timer.startTime) {
        this.notificationService.abortNotification(timer.startTime);
        this.startTime.set(new Date());
        const remainingMilliseconds = Math.max(
          timer.millisecondsOffset - (Date.now() - timer.startTime),
          0,
        );
        this._remainingMilliseconds.set(remainingMilliseconds);
        this.millisecondsOffset.set(remainingMilliseconds);
      }
    }
    effect(() => {
      localStorage.setItem(
        this.TIMER_KEY,
        JSON.stringify({
          millisecondsOffset: this.millisecondsOffset(),
          status: this._status(),
          startTime: this.startTime()?.getTime() || null,
        }),
      );
    });
    effect(() => {
      if (this._status() === RunnerStatus.play) {
        this.notificationService.notifyAfter(
          this.millisecondsOffset(),
          this.startTime()!.getTime(),
        );
        this.interval = window.setInterval(() => {
          this._remainingMilliseconds.set(
            Math.max(
              this.millisecondsOffset() -
                (Date.now() - this.startTime()!.getTime()),
              0,
            ),
          );
          if (this._remainingMilliseconds() < 10) {
            this.stop(false);
          }
        }, 10);
      }

      this.destroyRef.onDestroy(() => {
        if (this.interval !== null) clearInterval(this.interval);
      });
    });
  }

  setRemainingMilliseconds(millisecons: number) {
    if (this._status() !== RunnerStatus.stop) {
      throw 'TIMER_RUNNING';
    }
    this.millisecondsOffset.set(millisecons);
    this._remainingMilliseconds.set(millisecons);
  }

  play() {
    if (this._status() === RunnerStatus.play) {
      throw 'TIMER_ALREADY_STARTED';
    }
    this._status.set(RunnerStatus.play);
    this.startTime.set(new Date());
  }

  pause() {
    if (this._status() !== RunnerStatus.play) {
      throw 'TIMER_NOT_STARTED';
    }
    this._status.set(RunnerStatus.pause);
    this.notificationService.abortNotification(this.startTime()!.getTime());
    if (this.interval !== null) clearInterval(this.interval);
    this.startTime.set(null);
    this.millisecondsOffset.set(this.remainingMilliseconds());
  }

  stop(abort = true) {
    if (this._status() === RunnerStatus.stop) {
      throw 'TIMER_NOT_STARTED';
    }
    this._status.set(RunnerStatus.stop);
    if (abort)
      this.notificationService.abortNotification(this.startTime()!.getTime());
    if (this.interval !== null) clearInterval(this.interval);
    this.startTime.set(null);
    this.millisecondsOffset.set(0);
    this._remainingMilliseconds.set(0);
  }
}

interface Timer {
  startTime: number | null;
  millisecondsOffset: number;
  status: RunnerStatus;
}
