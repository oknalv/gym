import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerDialogComponent } from './timer-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TimerDialogComponent', () => {
  let component: TimerDialogComponent;
  let fixture: ComponentFixture<TimerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimerDialogComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TimerDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('secondsToFinish', 1);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
