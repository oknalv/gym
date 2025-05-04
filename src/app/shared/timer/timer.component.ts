import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { getHoursMinutesSecondsAndMilliseconds } from '../../utils';

@Component({
  selector: 'gym-timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  startingTime = input.required<Date>();
  millisecondsToFinish = input<number>(0);
  elapsedTime = signal({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  private destroyRef = inject(DestroyRef);
  formattedHours = computed(() => {
    const hours = this.elapsedTime().hours;
    return hours > 0 ? (hours > 9 ? hours.toString() : '0' + hours) : null;
  });
  formattedMinutes = computed(() => {
    const minutes = this.elapsedTime().minutes;
    return minutes > 9 ? minutes.toString() : '0' + minutes;
  });
  formattedSeconds = computed(() => {
    const seconds = this.elapsedTime().seconds;
    return seconds > 9 ? seconds.toString() : '0' + seconds;
  });
  formattedCentiseconds = computed(() => {
    const centiseconds = Math.floor(this.elapsedTime().milliseconds / 10);
    return centiseconds > 9 ? centiseconds.toString() : '0' + centiseconds;
  });

  constructor() {
    let timerInterval: number;
    effect(() => {
      timerInterval = window.setInterval(() => {
        console.log(this.millisecondsToFinish());
        const elapsedMilliseconds =
          Date.now() -
          this.startingTime().getTime() -
          this.millisecondsToFinish();
        this.elapsedTime.set(
          getHoursMinutesSecondsAndMilliseconds(Math.abs(elapsedMilliseconds)),
        );
      }, 10);
    });
    this.destroyRef.onDestroy(() => {
      if (timerInterval) clearInterval(timerInterval);
    });
  }
}
