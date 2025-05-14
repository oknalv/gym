import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { getHoursMinutesSecondsAndMilliseconds } from '../utils';
import { WatchComponent } from '../shared/watch/watch.component';
import { TranslatePipe } from '@ngx-translate/core';
import { IconComponent } from '../shared/icon/icon.component';
import { StopwatchService } from '../services/stopwatch.service';

@Component({
  selector: 'gym-stopwatch',
  imports: [WatchComponent, TranslatePipe, IconComponent],
  templateUrl: './stopwatch.component.html',
  styleUrl: './stopwatch.component.scss',
})
export class StopwatchComponent {
  private _time = signal(0);
  time = computed(() => {
    return getHoursMinutesSecondsAndMilliseconds(this._time());
  });
  private stopwatchService = inject(StopwatchService);
  private destroyRef = inject(DestroyRef);
  laps = computed(() => {
    return this.stopwatchService
      .laps()
      .reduce(
        (accumulator, lap) => {
          let lap2 = { value: lap, difference: lap };
          if (accumulator.length > 0) {
            lap2.difference -= accumulator.at(-1)!.value;
          }
          accumulator.push(lap2);
          return accumulator;
        },
        [] as { value: number; difference: number }[],
      )
      .map((lap) => {
        return {
          value: getHoursMinutesSecondsAndMilliseconds(lap.value),
          difference: getHoursMinutesSecondsAndMilliseconds(lap.difference),
        };
      })
      .reverse();
  });
  status = this.stopwatchService.status;
  hasStarted = computed(() => {
    return this._time() > 0;
  });

  nextLap = computed(() => {
    if (this.laps().length === 0) return null;
    return {
      value: this.time(),
      difference: getHoursMinutesSecondsAndMilliseconds(
        this._time() - this.stopwatchService.laps().at(-1)!,
      ),
    };
  });

  constructor() {
    const interval = window.setInterval(() => {
      this._time.set(this.stopwatchService.millisecondsElapsed);
    }, 10);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }

  onPlay() {
    this.stopwatchService.play();
  }

  onPause() {
    this.stopwatchService.pause();
  }

  onStop() {
    this.stopwatchService.stop();
  }

  onAddLap() {
    this.stopwatchService.addLap();
  }
}
