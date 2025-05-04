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
  startingTime = signal<Date | null>(null);
  secondsToFinish = input.required<number>();

  constructor() {
    effect(() => {
      if (this.open()) {
        this.startingTime.set(new Date());
      } else {
        this.startingTime.set(null);
      }
    });
  }

  onClose() {
    this.open.set(false);
  }
}
