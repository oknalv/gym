import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingSetComponent } from './ongoing-set.component';
import { ProgressType, WeightType } from '../../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('OngoingSetComponent', () => {
  let component: OngoingSetComponent;
  let fixture: ComponentFixture<OngoingSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingSetComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingSetComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('weighted', false);
    fixture.componentRef.setInput('weightType', WeightType.side);
    fixture.componentRef.setInput('set', {
      repetitions: 1,
      time: 1,
      weight: 1,
    });
    fixture.componentRef.setInput('progressType', ProgressType.repetitions);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
