import { of } from 'rxjs';

export class MockTimerService {
  play() {
    return of(1);
  }

  stop() {}

  getTimer() {}
}
