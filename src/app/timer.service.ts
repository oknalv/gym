import { computed, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private readonly TIMERS_KEY = 'gym-timers';
  private timers = new Map<string, [Timer, BehaviorSubject<number>]>();
  private messageChannel = new MessageChannel();
  private notificationAudio = new Audio('timer-beep.mp3');
  private configurationService = inject(ConfigurationService);
  private timerSound = computed(
    () => this.configurationService.configuration().timerSound,
  );

  constructor() {
    const timers: [string, Timer][] = JSON.parse(
      window.localStorage.getItem(this.TIMERS_KEY) || '[]',
    );
    timers.forEach(([timerId, timer]) => {
      if (timer.persist) {
        const remainingMilliseconds = Math.max(
          timer.remainingMilliseconds - (Date.now() - timer.lastUpdate),
          0,
        );
        if (remainingMilliseconds > 0) {
          this.play(timerId, remainingMilliseconds, timer.text);
        }
      } else {
        this.stop(timerId);
      }
    });
    this.updateLocalStorage();
    navigator.serviceWorker.ready.then(() => {
      navigator.serviceWorker.controller!.postMessage(
        { type: 'PORT_INITIALIZATION' },
        [this.messageChannel.port2],
      );
      this.messageChannel.port1.onmessage = (event) => {
        const timerId = event.data.timerId;
        const remainingMilliseconds = event.data.remainingMilliseconds;
        const timerTuple = this.timers.get(timerId);
        if (timerTuple) {
          timerTuple[1].next(remainingMilliseconds);
          this.timers.set(timerId, [
            { ...timerTuple[0], remainingMilliseconds, lastUpdate: Date.now() },
            timerTuple[1],
          ]);
        }
        if (remainingMilliseconds === 0) {
          if (this.timerSound()) this.notificationAudio.play();
          this.timers.get(timerId)?.[1].complete();
          this.timers.delete(timerId);
        }
        this.updateLocalStorage();
      };
    });
  }

  play(timerId: string, milliseconds: number, text: string, persist = true) {
    navigator.serviceWorker.controller!.postMessage({
      timerId,
      milliseconds,
      text,
      type: 'play',
    });
    this.timers.set(timerId, [
      {
        remainingMilliseconds: milliseconds,
        lastUpdate: Date.now(),
        text,
        persist,
      },
      new BehaviorSubject(milliseconds),
    ]);
    this.updateLocalStorage();
    return this.getTimer(timerId)!;
  }

  stop(timerId: string) {
    navigator.serviceWorker.controller!.postMessage({
      timerId,
      type: 'stop',
    });
    this.timers.get(timerId)?.[1].complete();
    this.timers.delete(timerId);
    this.updateLocalStorage();
  }

  getTimer(timerId: string) {
    return this.timers.get(timerId)?.[1].asObservable();
  }

  private updateLocalStorage() {
    window.localStorage.setItem(
      this.TIMERS_KEY,
      JSON.stringify(
        [...this.timers.entries()].map(([timerId, [timer, _]]) => [
          timerId,
          timer,
        ]),
      ),
    );
  }
}

interface Timer {
  remainingMilliseconds: number;
  lastUpdate: number;
  text: string;
  persist: boolean;
}
