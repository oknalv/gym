import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingExerciseComponent } from './ongoing-exercise.component';
import { ProgressType, WeightType } from '../../gym.model';
import { TranslateModule } from '@ngx-translate/core';
import { ExecutionService } from '../../services/execution.service';

describe('OngoingExerciseComponent', () => {
  let component: OngoingExerciseComponent;
  let fixture: ComponentFixture<OngoingExerciseComponent>;
  const mockExecutionService = jasmine.createSpyObj('ExecutionService', [
    'ongoingExecution',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingExerciseComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ExecutionService,
          useValue: mockExecutionService,
        },
      ],
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
    fixture.componentRef.setInput('isLastExercise', false);
    fixture.componentRef.setInput('timerId', 'timerId');
    mockExecutionService.ongoingExecution.and.returnValue({
      workoutId: 0,
      completedExerciseIds: [],
      ongoingExerciseId: null,
      restingStart: null,
      setIndex: 0,
    });
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
