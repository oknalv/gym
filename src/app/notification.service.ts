import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    Notification.requestPermission();
  }

  get enabled() {
    return Notification.permission === 'granted';
  }

  async notify() {
    if (this.enabled) {
      const registration = await navigator.serviceWorker.ready;
      registration.active!.postMessage({
        type: 'immediate',
        text: 'immediate',
      });
    }
  }

  async notifyAfter(milliseconds: number, notificationId: number) {
    if (this.enabled) {
      const registration = await navigator.serviceWorker.ready;
      registration.active!.postMessage({
        type: 'delayed',
        timeout: milliseconds,
        text: 'delayed',
        notificationId,
      });
    }
  }

  async abortNotification(notificationId: number) {
    if (this.enabled) {
      const registration = await navigator.serviceWorker.ready;
      registration.active!.postMessage({
        type: 'abort',
        notificationId,
      });
    }
  }
}
