import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { RunnerStatus } from './common.model';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private TIMER_KEY = 'gym-timer';
  private _remainingMilliseconds = signal(0);
  remainingMilliseconds = this._remainingMilliseconds.asReadonly();
  private _status = signal<RunnerStatus>(RunnerStatus.stop);
  status = this._status.asReadonly();
  private destroyRef = inject(DestroyRef);
  private interval: number | null = null;

  constructor() {
    const timer: Timer | null = JSON.parse(
      window.localStorage.getItem(this.TIMER_KEY) || 'null',
    );
    if (timer) {
      this._remainingMilliseconds.set(
        Math.max(
          timer.remainingMilliseconds - (Date.now() - timer.lastUpdated),
          0,
        ),
      );
      this._status.set(timer.status);
    }
    effect(() => {
      localStorage.setItem(
        this.TIMER_KEY,
        JSON.stringify({
          remainingMilliseconds: this.remainingMilliseconds(),
          status: this._status(),
          lastUpdated: Date.now(),
        }),
      );
    });
    effect(() => {
      if (this._status() === RunnerStatus.play) {
        this.interval = window.setInterval(() => {
          this._remainingMilliseconds.update((milliseconds) => {
            return milliseconds - 10;
          });
          if (this._remainingMilliseconds() < 10) {
            this.stop();
          }
        }, 10);
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.interval !== null) clearInterval(this.interval);
    });
  }

  setRemainingMilliseconds(millisecons: number) {
    if (this._status() !== RunnerStatus.stop) {
      throw 'TIMER_RUNNING';
    }
    this._remainingMilliseconds.set(millisecons);
  }

  play() {
    if (this._status() === RunnerStatus.play) {
      throw 'TIMER_ALREADY_STARTED';
    }
    this._status.set(RunnerStatus.play);
  }

  pause() {
    if (this._status() !== RunnerStatus.play) {
      throw 'TIMER_NOT_STARTED';
    }
    if (this.interval !== null) clearInterval(this.interval);
    this._status.set(RunnerStatus.pause);
  }

  stop() {
    if (this._status() === RunnerStatus.stop) {
      throw 'TIMER_NOT_STARTED';
    }
    if (this.interval !== null) clearInterval(this.interval);
    this._remainingMilliseconds.set(0);
    this._status.set(RunnerStatus.stop);
  }
}

interface Timer {
  lastUpdated: number;
  remainingMilliseconds: number;
  status: RunnerStatus;
}
