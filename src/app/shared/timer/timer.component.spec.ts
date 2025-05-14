import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { TimerService } from '../../services/timer.service';
import { MockTimerService } from '../../../../test/mock-timer.service';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerComponent],
      providers: [
        {
          provide: TimerService,
          useClass: MockTimerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('timerId', 'timerId');
    fixture.componentRef.setInput('millisecondsToRun', 1);
    fixture.componentRef.setInput('notificationText', 'notificationText');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
