import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetComponent } from './set.component';
import { ProgressType } from '../../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('SetComponent', () => {
  let component: SetComponent;
  let fixture: ComponentFixture<SetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('set', {
      weight: 1,
      time: 2,
      repetitions: 3,
    });
    fixture.componentRef.setInput('weighted', true);
    fixture.componentRef.setInput('progressType', ProgressType.repetitions);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display weight when it is weighted', () => {
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerText).toBe('1 kg × 3 reps');
  });

  it('should not display weight when it is not weighted', () => {
    fixture.componentRef.setInput('weighted', false);
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerText).toBe('3 reps');
  });

  it('should display repetitions when progress type is repetitions', () => {
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerText).toBe('1 kg × 3 reps');
  });

  it('should display time when progress type is time', () => {
    fixture.componentRef.setInput('progressType', ProgressType.time);
    fixture.detectChanges();
    expect(fixture.elementRef.nativeElement.innerText).toBe('1 kg × 2s');
  });
});
