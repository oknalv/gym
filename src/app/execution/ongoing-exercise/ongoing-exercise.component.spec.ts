import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingExerciseComponent } from './ongoing-exercise.component';
import { ProgressType, WeightType } from '../../gym.model';
import { TranslateModule } from '@ngx-translate/core';

describe('OngoingExerciseComponent', () => {
  let component: OngoingExerciseComponent;
  let fixture: ComponentFixture<OngoingExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingExerciseComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingExerciseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exercise', {
      id: 0,
      type: { id: 0, name: 'name', image: undefined },
      progressType: ProgressType.repetitions,
      restingTime: 1,
      sets: [{ repetitions: 1, time: 1, weight: 1 }],
      weighted: true,
      weightType: WeightType.total,
    });
    fixture.componentRef.setInput('setIndex', 0);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
