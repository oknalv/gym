import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingSupersetExerciseComponent } from './ongoing-superset-exercise.component';
import { ProgressType, WeightType } from '../../../gym.model';

describe('OngoingSupersetExerciseComponent', () => {
  let component: OngoingSupersetExerciseComponent;
  let fixture: ComponentFixture<OngoingSupersetExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingSupersetExerciseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingSupersetExerciseComponent);
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
