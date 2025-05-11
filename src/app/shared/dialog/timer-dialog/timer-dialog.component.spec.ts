import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDialogComponent } from './timer-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { TimerService } from '../../../timer.service';
import { MockTimerService } from '../../../../../test/mock-timer.service';

describe('TimerDialogComponent', () => {
  let component: TimerDialogComponent;
  let fixture: ComponentFixture<TimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerDialogComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: TimerService,
          useClass: MockTimerService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('secondsToFinish', 1);
    fixture.componentRef.setInput('timerId', 'timerId');
    fixture.componentRef.setInput('notificationText', 'notificationText');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
