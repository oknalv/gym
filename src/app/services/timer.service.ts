import { computed, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly TIMERS_KEY = 'gym-timers';
  private timers = new Map<string, Timer>();
  private notificationAudio = new Audio('timer-beep.mp3');
  private configurationService = inject(ConfigurationService);
  private timerSound = computed(
    () => this.configurationService.configuration().timerSound,
  );

  constructor() {
    const timers: [string, TimerDTO][] = JSON.parse(
      window.localStorage.getItem(this.TIMERS_KEY) || '[]',
    );
    timers.forEach(([timerId, timer]) => {
      if (timer.persist) {
        const remainingMilliseconds = Math.max(
          timer.remainingMilliseconds - (Date.now() - timer.lastUpdate),
          1000,
        );
        this.play(timerId, remainingMilliseconds, timer.text, timer.persist);
      } else {
        this.stop(timerId);
      }
    });
    this.updateLocalStorage();
  }

  play(timerId: string, milliseconds: number, text: string, persist = true) {
    if (!this.timers.has(timerId)) {
      const startTime = Date.now();
      const interval = window.setInterval(() => {
        const remainingMilliseconds = Math.max(
          milliseconds - (Date.now() - startTime),
          0,
        );
        const timer = this.timers.get(timerId)!;
        timer.subject.next(remainingMilliseconds);
        this.timers.set(timerId, {
          ...timer,
          timerDto: {
            ...timer.timerDto,
            remainingMilliseconds,
            lastUpdate: Date.now(),
          },
        });
        if (remainingMilliseconds === 0) {
          clearInterval(interval);
          timer.subject.complete();
          this.timers.delete(timerId);
          if (this.timerSound()) this.notificationAudio.play();
          new Notification('Gym', {
            body: text,
            icon: 'icons/favicon.png',
            badge: 'icons/favicon.png',
            silent: false,
            tag: timerId,
          });
        }
        this.updateLocalStorage();
      });
      this.timers.set(timerId, {
        timerDto: {
          remainingMilliseconds: milliseconds,
          lastUpdate: Date.now(),
          text,
          persist,
        },
        subject: new BehaviorSubject(milliseconds),
        interval,
      });
      this.updateLocalStorage();
      return this.getTimer(timerId)!;
    }
    throw 'TIMER_ALREADY_STARTED';
  }

  stop(timerId: string) {
    const timer = this.timers.get(timerId);
    if (timer) {
      clearInterval(timer.interval);
      timer.subject.complete();
      this.timers.delete(timerId);
      this.updateLocalStorage();
    }
  }

  getTimer(timerId: string) {
    return this.timers.get(timerId)?.subject.asObservable();
  }

  private updateLocalStorage() {
    window.localStorage.setItem(
      this.TIMERS_KEY,
      JSON.stringify(
        [...this.timers.entries()].map(([timerId, { timerDto }]) => [
          timerId,
          timerDto,
        ]),
      ),
    );
  }
}

interface Timer {
  timerDto: TimerDTO;
  subject: BehaviorSubject<number>;
  interval: number;
}

interface TimerDTO {
  remainingMilliseconds: number;
  lastUpdate: number;
  text: string;
  persist: boolean;
}
