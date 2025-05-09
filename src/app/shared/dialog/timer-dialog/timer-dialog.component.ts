import { Component, effect, inject, input, model, signal } from '@angular/core';
import { DialogComponent } from '../dialog.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TimerComponent } from '../../timer/timer.component';
import { NotificationService } from '../../../notification.service';

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
  private notificationService = inject(NotificationService);

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
    this.notificationService.notify();
    this.open.set(false);
  }
}
