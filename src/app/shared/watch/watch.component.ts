import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'gym-watch',
  imports: [],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
  host: {
    '[class.paused]': 'paused()',
  },
})
export class WatchComponent {
  time = input.required<{
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  }>();
  hideCentiseconds = input<boolean>(false);
  paused = input<boolean>(false);

  formattedHours = computed(() => {
    const hours = this.time().hours;
    return hours > 0 ? (hours > 9 ? hours.toString() : '0' + hours) : null;
  });
  formattedMinutes = computed(() => {
    const minutes = this.time().minutes;
    return minutes > 9 ? minutes.toString() : '0' + minutes;
  });
  formattedSeconds = computed(() => {
    const seconds = this.time().seconds;
    return seconds > 9 ? seconds.toString() : '0' + seconds;
  });
  formattedCentiseconds = computed(() => {
    const centiseconds = Math.floor(this.time().milliseconds / 10);
    return centiseconds > 9 ? centiseconds.toString() : '0' + centiseconds;
  });

  getComplement(digits: string) {
    return digits
      .split('')
      .map((digit) => `${digit}_comp`)
      .join('');
  }
}
