import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseComponent } from './exercise.component';
import { ProgressType, WeightType } from '../exercise.model';

describe('ExerciseComponent', () => {
  let component: ExerciseComponent;
  let fixture: ComponentFixture<ExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exercise', {
      id: 0,
      type: { id: 0, name: 'name', image: undefined },
      weighted: true,
      weightType: WeightType.total,
      progressType: ProgressType.repetitions,
      sets: [
        {
          weight: 1,
          repetitions: 1,
          time: 1,
        },
      ],
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
