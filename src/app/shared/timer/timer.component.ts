import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { getHoursMinutesSecondsAndMilliseconds } from '../../utils';
import { WatchComponent } from '../watch/watch.component';
import { TimerService } from '../../timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gym-timer',
  imports: [WatchComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit {
  timerId = input.required<string>();
  millisecondsToRun = input.required<number>();
  notificationText = input.required<string>();
  persist = input(true);
  private timerService = inject(TimerService);
  private _time = signal(0);
  time = computed(() => {
    return getHoursMinutesSecondsAndMilliseconds(this._time());
  });
  private timerSubscription?: Subscription;
  stop = output<void>();
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.timerSubscription?.unsubscribe();
      if (this._time() <= 0 || !this.persist())
        this.timerService.stop(this.timerId());
    });
  }

  ngOnInit() {
    let timerObservable = this.timerService.getTimer(this.timerId());
    if (!timerObservable) {
      timerObservable = this.timerService.play(
        this.timerId(),
        this.millisecondsToRun(),
        this.notificationText(),
        this.persist(),
      );
    }
    this.timerSubscription = timerObservable!.subscribe({
      next: (value) => {
        this._time.set(value);
      },
      complete: () => {
        this.stop.emit();
      },
    });
  }
}
