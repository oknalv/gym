import { TestBed } from '@angular/core/testing';

import { TimerService } from './timer.service';
import { TranslateModule } from '@ngx-translate/core';

describe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
