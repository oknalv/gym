import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingExercisePreviewComponent } from './ongoing-exercise-preview.component';
import { ProgressType, WeightType } from '../../../gym.model';
import { ExecutionService } from '../../../execution.service';
import { TranslateModule } from '@ngx-translate/core';

describe('OngoingExercisePreviewComponent', () => {
  let component: OngoingExercisePreviewComponent;
  let fixture: ComponentFixture<OngoingExercisePreviewComponent>;
  const mockExecutionService = jasmine.createSpyObj('ExecutionService', [
    'ongoingExecution',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingExercisePreviewComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ExecutionService,
          useValue: mockExecutionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingExercisePreviewComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('exercises', [
      {
        id: 0,
        type: { id: 0, name: 'name', image: undefined },
        progressType: ProgressType.repetitions,
        restingTime: 1,
        sets: [{ repetitions: 1, time: 1, weight: 1 }],
        weighted: true,
        weightType: WeightType.total,
      },
    ]);
    mockExecutionService.ongoingExecution.and.returnValue({
      workoutId: 1,
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
