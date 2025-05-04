import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingExercisePreviewComponent } from './ongoing-exercise-preview.component';
import { ProgressType, WeightType } from '../../../gym.model';

describe('OngoingExercisePreviewComponent', () => {
  let component: OngoingExercisePreviewComponent;
  let fixture: ComponentFixture<OngoingExercisePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingExercisePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingExercisePreviewComponent);
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
