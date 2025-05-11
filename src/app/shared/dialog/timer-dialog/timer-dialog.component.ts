import { Component, effect, input, model, signal } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerComponent } from '../../timer/timer.component';

@Component({
  selector: 'gym-timer-dialog',
  imports: [DialogComponent, TranslatePipe, TimerComponent],
  templateUrl: './timer-dialog.component.html',
  styleUrl: './timer-dialog.component.scss',
})
export class TimerDialogComponent {
  open = model.required<boolean>();
  timerId = input.required<string>();
  secondsToFinish = input.required<number>();
  notificationText = input.required<string>();
  millisecondsToFinish = signal<number | null>(null);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.millisecondsToFinish.set(this.secondsToFinish() * 1000);
      } else {
        this.millisecondsToFinish.set(null);
      }
    });
  }

  onClose() {
    this.open.set(false);
  }
}
