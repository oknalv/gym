import { computed, effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StopwatchService {
  private STOPWATCH_KEY = 'gym-stopwatch';
  private startTime = signal<Date | null>(null);
  private millisecondsOffset = signal(0);
  private _laps = signal<number[]>([]);
  laps = this._laps.asReadonly();
  status = computed(() => {
    if (!this.startTime()) {
      if (this.millisecondsOffset() > 0) return StopwatchStatus.pause;
      else return StopwatchStatus.stop;
    }
    return StopwatchStatus.play;
  });

  get millisecondsElapsed() {
    if (!this.startTime()) return this.millisecondsOffset();
    return (
      this.millisecondsOffset() +
      new Date().getTime() -
      this.startTime()!.getTime()
    );
  }

  constructor() {
    const stopwatch: Stopwatch | null = JSON.parse(
      window.localStorage.getItem(this.STOPWATCH_KEY) || 'null',
    );
    if (stopwatch) {
      if (stopwatch.startTime) {
        this.startTime.set(new Date(stopwatch.startTime));
      }
      this.millisecondsOffset.set(stopwatch.millisecondsOffset);
      this._laps.set(stopwatch.laps);
    }
    effect(() => {
      localStorage.setItem(
        this.STOPWATCH_KEY,
        JSON.stringify({
          startTime: this.startTime()?.getTime() || null,
          millisecondsOffset: this.millisecondsOffset(),
          laps: this._laps(),
        }),
      );
    });
  }

  play() {
    if (this.startTime()) {
      throw 'STOPWATCH_ALREADY_STARTED';
    }
    this.startTime.set(new Date());
  }

  pause() {
    if (!this.startTime()) {
      throw 'STOPWATCH_NOT_STARTED';
    }
    this.millisecondsOffset.set(this.millisecondsElapsed);
    this.startTime.set(null);
  }

  stop() {
    if (!this.startTime() && this.millisecondsElapsed === 0) {
      throw 'STOPWATCH_NOT_STARTED';
    }
    this.millisecondsOffset.set(0);
    this.startTime.set(null);
    this._laps.set([]);
  }

  addLap() {
    this._laps.update((laps) => {
      return [...laps, this.millisecondsElapsed];
    });
  }
}

interface Stopwatch {
  startTime: number | null;
  millisecondsOffset: number;
  laps: number[];
  status: StopwatchStatus;
}

export enum StopwatchStatus {
  stop = 'stop',
  play = 'play',
  pause = 'pause',
}
