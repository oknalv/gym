import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { getHoursMinutesSecondsAndMilliseconds } from '../../utils';
import { WatchComponent } from '../watch/watch.component';

@Component({
  selector: 'gym-timer',
  imports: [WatchComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  startingTime = input.required<Date>();
  millisecondsToFinish = input<number>(0);
  stopOnZero = input<boolean>(false);
  stop = output<void>();
  elapsedTime = signal({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  private destroyRef = inject(DestroyRef);

  constructor() {
    let timerInterval: number;
    effect(() => {
      timerInterval = window.setInterval(() => {
        const elapsedMilliseconds =
          Date.now() -
          this.startingTime().getTime() -
          this.millisecondsToFinish();
        this.elapsedTime.set(
          getHoursMinutesSecondsAndMilliseconds(Math.abs(elapsedMilliseconds)),
        );
        if (this.stopOnZero() && elapsedMilliseconds > 0) {
          this.stop.emit();
          clearInterval(timerInterval);
          this.elapsedTime.set({
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0,
          });
        }
      }, 10);
    });
    this.destroyRef.onDestroy(() => {
      if (timerInterval) clearInterval(timerInterval);
    });
  }
}
